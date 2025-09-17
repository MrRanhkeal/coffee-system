const paymentService = require("../services/payment.service");
const { logErr } = require("../util/logErr");

// Generate KHQR for an ad-hoc amount (USD by default)
exports.generateKHQRCode = async (req, res) => {
    try {
        const { amount, description } = req.body || {};
        if (!amount || Number(amount) <= 0) {
            return res.status(400).json({ message: "amount required" });
        }

        const { orderNo, orderId, qr, md5, expiresAt } = await paymentService.generateQR({
            amount: Number(amount),
            currency: 'USD',
            description: description || undefined,
        });

        return res.json({
            message: "QR generated",
            qr,
            md5,
            expiresAt,
            payment_status: "pending",
            data: { order_no: orderNo, order_id: orderId }
        });

    } catch (err) {
        logErr("payment.generateKHQRCode", err, res);
    }
};

// Check payment status by md5 using service (handles timeout gracefully)
exports.checkPayment = async (req, res) => {
    try {
        const { md5 } = req.body;
        if (!md5) return res.status(400).json({ message: "md5 required" });

        const data = await paymentService.checkPayment(md5);
        return res.json({ message: "Payment status", data });
    } catch (err) {
        logErr("payment.checkPayment", err, res);
    }
};

exports.getOrderInfo = async (req, res) => {
    try {
        const order = await paymentService.getOrderInfo(req.params.id);
        if (!order) return res.status(404).json({ message: "Order not found" });

        res.json({ message: "Order info", data: order });
    } catch (err) {
        logErr("payment.getOrderInfo", err, res);
    }
}

// Manually force-complete a payment (used when Bakong API is unreachable)
exports.forceComplete = async (req, res) => {
    try {
        const { md5, ...fields } = req.body || {};
        if (!md5) return res.status(400).json({ message: "md5 required" });

        const data = await paymentService.forceComplete(md5, fields);
        return res.json({ message: "Payment forced complete", data });
    } catch (err) {
        logErr("payment.forceComplete", err, res);
    }
}
