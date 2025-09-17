const { BakongKHQR, khqrData, IndividualInfo } = require("bakong-khqr");
const axios = require("axios");
const { db, logErr } = require("../util/helper");
const { BAKONG } = require("../util/config");

let tokenCache = {
    accessToken: null,
    expiresAt: 0,
};

// Force complete a payment locally (manual confirmation). Optionally accept Bakong fields.
exports.forceComplete = async (md5, fields = {}) => {
    try {
        const [rows] = await db.query("SELECT * FROM payment_orders WHERE md5=:md5", { md5 });
        if (!rows.length) throw new Error("Payment record not found");
        const payment = rows[0];

        // Try to enrich fields by calling Bakong (best-effort). If it fails, proceed with manual confirmation.
        const enriched = { ...fields };
        try {
            const response = await axios.post(
                `${BAKONG.BASE_URL}/check_transaction_by_md5`,
                { md5 },
                { headers: { Authorization: `Bearer ${BAKONG.ACCESS_TOKEN}` }, timeout: 4000 }
            );
            const data = response.data || {};
            const br = data.bakongRes || data.bakong_res || data.data || {};
            const success = (data?.status === "SUCCESS") || (data?.response_code === 0 && (br?.hash || data?.hash));
            if (success) {
                const fromAccountId = br.fromAccountId || br.from?.accountId || br.fromAccount || br.from_account_id || null;
                const toAccountId = br.toAccountId || br.to?.accountId || br.toAccount || br.to_account_id || BAKONG.ACCOUNT_ID || null;

                enriched.bakongHash = enriched.bakongHash || br.hash || data?.hash || null;
                enriched.fromAccountId = enriched.fromAccountId || fromAccountId;
                enriched.toAccountId = enriched.toAccountId || toAccountId;
                enriched.currency = enriched.currency || br.currency || payment.currency || null;
                enriched.amount = enriched.amount || br.amount || payment.amount || null;
                enriched.externalRef = enriched.externalRef || br.externalRef || br.external_ref || null;
                enriched.createdDateMs = enriched.createdDateMs || br.createdDateMs || br.createdDate || null;
                enriched.acknowledgedDateMs = enriched.acknowledgedDateMs || br.acknowledgedDateMs || br.acknowledgedDate || null; 
                enriched.receiverBankAccount = enriched.receiverBankAccount || toAccountId || null; 
            }
        } catch (_) {
            // ignore network/parse errors; we'll still mark as paid locally
        }

        await db.query(`
            UPDATE payment_orders
            SET status='paid',
                paid=1,
                paidAt=NOW(),
                bakongHash=COALESCE(:bakongHash, bakongHash),
                fromAccountId=COALESCE(:fromAccountId, fromAccountId),
                toAccountId=COALESCE(:toAccountId, toAccountId),
                currency=COALESCE(:currency, currency),
                amount=COALESCE(:amount, amount),
                externalRef=COALESCE(:externalRef, externalRef),
                createdDateMs=COALESCE(:createdDateMs, createdDateMs),
                acknowledgedDateMs=COALESCE(:acknowledgedDateMs, acknowledgedDateMs), 
                receiverBankAccount=COALESCE(:receiverBankAccount, receiverBankAccount)
            WHERE md5=:md5
        `, {
            md5,
            bakongHash: enriched.bakongHash || null,
            fromAccountId: enriched.fromAccountId || null,
            toAccountId: enriched.toAccountId || null,
            currency: enriched.currency || null,
            amount: enriched.amount || null,
            externalRef: enriched.externalRef || null,
            createdDateMs: enriched.createdDateMs || null,
            acknowledgedDateMs: enriched.acknowledgedDateMs || null, 
            receiverBankAccount: enriched.receiverBankAccount || null, 
        });

        await db.query(
            "UPDATE orders SET paid_amount = total_amount, payment_method = 'QR' WHERE id = :order_id",
            { order_id: payment.order_id }
        );

        return {
            bakong_status: 'MANUAL_CONFIRMED',
            local_status: 'paid',
            payment: { ...payment, status: 'paid', paid: 1 }
        };
    } catch (err) {
        logErr("forceComplete", err);
        throw err;
    }
};
const _getAccessToken = async () => {
    if (tokenCache.accessToken && Date.now() < tokenCache.expiresAt) {
        return tokenCache.accessToken;
    }

    console.log('Fetching new Bakong access token...');
    try {
        const response = await axios.post(`${process.env.BAKONG_BASE_URL}/token`, {
            merchant_id: process.env.BAKONG_MERCHANT_ID,
            secret: process.env.BAKONG_SECRET,
        });

        const { accessToken, expiresIn } = response.data.data;

        // Store the new token and calculate its expiry time (with a 60-second buffer)
        tokenCache.accessToken = accessToken;
        tokenCache.expiresAt = Date.now() + (expiresIn - 60) * 1000;

        return accessToken;
    } catch (error) { 
        console.error('Error fetching Bakong access token:', error);
        throw new Error('Could not authenticate with Bakong service.');
    }
};


// Fetch order by ID with optional payment info
exports.getOrderInfo = async (id) => {
    try {
        const [orders] = await db.query("SELECT * FROM orders WHERE id=:id", { id });
        if (!orders.length) return null;
        const order = orders[0];
        const [payments] = await db.query("SELECT * FROM payment_orders WHERE order_id=:order_id", { order_id: id });
        return { ...order, payment: payments[0] || null };
    } catch (err) {
        logErr("getOrderInfo", err);
        throw err;
    }
};

exports.generateQR = async ({ amount, currency = 'USD', description }) => {
    try {
        // Create order_no
        const [orderRows] = await db.query("SELECT order_no FROM orders ORDER BY create_at DESC LIMIT 1");
        let orderNo = "ORDER_00001";
        if (orderRows.length > 0) {
            const lastNumber = parseInt(orderRows[0].order_no.split('_')[1], 10);
            orderNo = `ORDER_${String(lastNumber + 1).padStart(5, '0')}`;
        }

        // Save order
        const [result] = await db.query(`
            INSERT INTO orders (order_no, total_amount, create_by)
            VALUES (:order_no, :total_amount, :create_by)
            `, { order_no: orderNo, total_amount: amount, create_by: "system" });

        const orderId = result.insertId;
        const expirationTimestamp = Date.now() + 5 * 60 * 1000;

        // Generate KHQR
        const individualInfo = new IndividualInfo(
            BAKONG.ACCOUNT_ID,
            BAKONG.ACCOUNT_NAME,
            BAKONG.CITY,
            {
                currency: String(currency).toLowerCase() === 'usd' ? khqrData.currency.usd : khqrData.currency.khr,
                amount,
                expirationTimestamp
            }
        );
        const khqr = new BakongKHQR();
        const qrData = khqr.generateIndividual(individualInfo);

        // Save to payment_orders
        await db.query(`
            INSERT INTO payment_orders (
                order_id, qr, md5, expiration, created_at, status, currency, amount, description, paid
            )
            VALUES (:order_id, :qr, :md5, :expiration, NOW(), 'pending', :currency, :amount, :description, 0)
        `, {
            order_id: orderId,
            qr: qrData.data.qr,
            md5: qrData.data.md5,
            expiration: expirationTimestamp,
            currency: 'USD',
            amount: amount,
            description: description || `Order ${orderNo}`
        });

        return { orderNo, orderId, qr: qrData.data.qr, md5: qrData.data.md5, expiresAt: expirationTimestamp };
    } catch (err) {
        logErr("generateQR", err);
        throw err;
    }
};

exports.checkPayment = async (md5) => {
    try {
        // Fetch local payment record first
        const [rows] = await db.query("SELECT * FROM payment_orders WHERE md5=:md5", { md5 });
        if (!rows.length) throw new Error("Payment record not found");

        const payment = rows[0];
        let newStatus = payment.status || "pending";
        let bakongStatus = "UNKNOWN";

        // If already expired locally
        if (Date.now() > Number(payment.expiration)) {
            newStatus = "expired";
            await db.query(
                "UPDATE payment_orders SET status=:status WHERE md5=:md5",
                { status: newStatus, md5 }
            );
            return { bakong_status: bakongStatus, local_status: newStatus, payment: { ...payment, status: newStatus } };
        }

        // Try contacting Bakong with a 5s timeout. If it fails, gracefully return local status.
        try {
            const response = await axios.post(
                `${BAKONG.BASE_URL}/check_transaction_by_md5`,
                { md5 },
                { headers: { Authorization: `Bearer ${BAKONG.ACCESS_TOKEN}` }, timeout: 5000 }
            );

            const raw = response.data || {};
            const br = raw.bakongRes || raw.bakong_res || raw.data || raw || {};
            const success = (
                raw?.status === "SUCCESS" ||
                raw?.response_code === 0 ||
                br?.status === "SUCCESS" ||
                !!(br?.hash || raw?.hash)
            );
            bakongStatus = raw?.status || raw?.response_description || br?.status || (success ? "SUCCESS" : "PENDING");

            if (success) {
                newStatus = "paid";

                const fromAccountId = br.fromAccountId || br.from?.accountId || br.fromAccount || br.from_account_id || br.from?.account_id || null;
                const toAccountId = br.toAccountId || br.to?.accountId || br.toAccount || br.to_account_id || br.to?.account_id || BAKONG.ACCOUNT_ID || null;
                const receiverBank = br.receiverBank || br.to?.bank || br.toBank || br.receiver_bank || null;
                const receiverBankAccount = toAccountId || br.receiverBankAccount || br.receiver_bank_account || null;

                // Debug: if critical fields are missing, log the available keys for inspection
                if (!(br.hash || raw?.hash) || !fromAccountId || !toAccountId) {
                    try {
                        await logErr(
                            "payment.checkPayment.debug",
                            `md5=${md5} missingFields: ${JSON.stringify({
                                hasHash: !!(br.hash || raw?.hash),
                                fromAccountId,
                                toAccountId
                            })}; brKeys=${Object.keys(br || {}).join(',')}; rawKeys=${Object.keys(raw || {}).join(',')}`
                        );
                    } catch (_) { }
                }

                await db.query(`
                    UPDATE payment_orders
                        SET status=:status,
                            paid=1,
                            paidAt=NOW(),
                            bakongHash=:bakongHash,
                            fromAccountId=:fromAccountId,
                            toAccountId=:toAccountId,
                            currency=COALESCE(currency, :currency),
                            amount=COALESCE(amount, :amount),
                            externalRef=:externalRef,
                            createdDateMs=:createdDateMs,
                            acknowledgedDateMs=:acknowledgedDateMs,
                            receiverBankAccount=:receiverBankAccount
                        WHERE md5=:md5
                    `, {
                    status: newStatus,
                    bakongHash: br.hash || raw?.hash || null,
                    fromAccountId,
                    toAccountId,
                    currency: br.currency || payment.currency || 'USD',
                    amount: br.amount || payment.amount || null,
                    externalRef: br.externalRef || br.external_ref || null,
                    createdDateMs: br.createdDateMs || br.createdDate || null,
                    acknowledgedDateMs: br.acknowledgedDateMs || br.acknowledgedDate || null, 
                    receiverBankAccount, 
                    md5
                });

                // Mark order as fully paid by QR
                await db.query(
                    "UPDATE orders SET paid_amount = total_amount, payment_method = 'QR' WHERE id = :order_id",
                    { order_id: payment.order_id }
                );
            } else {
                newStatus = (Date.now() > Number(payment.expiration)) ? "expired" : "pending";
                await db.query(
                    "UPDATE payment_orders SET status=:status WHERE md5=:md5",
                    { status: newStatus, md5 }
                );
            }

            return { bakong_status: bakongStatus, local_status: newStatus, payment: { ...payment, status: newStatus } };
        } catch (err) {
            // Network/timeout fallback
            const timedOut = err.code === 'ECONNABORTED' || err.code === 'ETIMEDOUT';
            if (Date.now() > Number(payment.expiration)) {
                newStatus = "expired";
                await db.query(
                    "UPDATE payment_orders SET status=:status WHERE md5=:md5",
                    { status: newStatus, md5 }
                );
            }
            return { bakong_status: timedOut ? 'TIMEOUT' : 'ERROR', local_status: newStatus, error: err.message, payment };
        }

    } catch (err) {
        logErr("checkPayment", err);
        throw err;
    }
}; 


