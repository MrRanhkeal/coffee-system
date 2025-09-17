const { db, logErr, isArray, isEmpty } = require("../util/helper");
const { BakongKHQR, khqrData, IndividualInfo } = require("bakong-khqr");
const { BAKONG } = require("../util/config");

exports.getlist = async (req, res) => {
    try {
        var txtSearch = req.query.txtSearch;
        var from_date = req.query.from_date;
        var to_date = req.query.to_date;
        var sqlSelect =
            "SELECT " +
            " o.* , c.name customer_name, c.phone customer_phone, c.address customer_address ";
        var sqlJoin =
            " FROM orders o  LEFT JOIN customers c ON o.customer_id = c.id";

        var sqlWhere = " Where true ";

        if (!isEmpty(txtSearch)) {
            sqlWhere += " AND order_no LIKE :txtSearch ";
        }
        // 2024-11-27 :from_date AND :to_date
        if (!isEmpty(from_date) && !isEmpty(to_date)) {
            // sqlWhere +=
            //   " AND DATE_FORMAT(o.create_at,'%Y-%m-%d')  >=  '2024-11-27' " +
            //   " AND  DATE_FORMAT(o.create_at,'%Y-%m-%d') <= '2024-11-27' ";
            sqlWhere +=
                " AND DATE_FORMAT(o.create_at,'%Y-%m-%d')  BETWEEN  :from_date AND :to_date ";
        }
        var sqlOrder = " ORDER BY o.id DESC ";

        var sqlParam = {
            txtSearch: "%" + txtSearch + "%",
            from_date: from_date,
            to_date: to_date,
        };
        var sqlList = sqlSelect + sqlJoin + sqlWhere + sqlOrder;

        var sqlSummary =
            " SELECT COUNT(o.id) total_order, SUM(o.total_amount) total_amount  " +
            sqlJoin +
            sqlWhere;
        const [list] = await db.query(sqlList, sqlParam);
        const [summary] = await db.query(sqlSummary, sqlParam);

        //var list = "select * from orders";

        res.json({
            list: list,
            summary: summary[0],
            message: "success"
        })
    }
    catch (error) {
        logErr("order.getlist", error, res);
    }
};

exports.orderdetail = async (req, res) => {
    try {
        var sql =
            "SELECT " +
            " od.*, " +
            " p.name p_name, " +
            " p.brand p_brand, " +
            " p.description p_des, " +
            " p.image p_image, " +
            " c.name p_category_name " +
            "FROM order_detail od " +
            "inner join products p on od.product_id = p.id " +
            "inner join category c on p.category_id = c.id " +
            "where od.order_id = :id";
        const [list] = await db.query(sql, { id: req.params.id });
        res.json({
            list: list,
            id: req.params.id,
        });
    } catch (error) {
        logErr("order.orderdetail", error, res);
    }
};
exports.create = async (req, res) => {
    try {
        let { order, order_details = [] } = req.body;

        // Prepare order
        order = {
            ...order,
            order_no: await newOrderNo(),
            user_id: req.auth?.id,
            create_by: req.auth?.name,
        };

        // Insert order
        const sqlOrder = `
            INSERT INTO orders 
            (order_no, customer_id, total_amount, paid_amount, payment_method, remark, user_id, create_by) 
            VALUES (:order_no, :customer_id, :total_amount, :paid_amount, :payment_method, :remark, :user_id, :create_by)
        `;
        const [result] = await db.query(sqlOrder, order);

        // Insert order details
        await Promise.all(order_details.map(item => {
            const sqlDetails = `
                INSERT INTO order_detail 
                (order_id, product_id, qty, price, discount, total, sugarLevel) 
                VALUES (:order_id, :product_id, :qty, :price, :discount, :total, :sugarLevel)
            `;
            return db.query(sqlDetails, { ...item, order_id: result.insertId });
        }));

        // Fetch inserted order
        const [currentOrder] = await db.query("SELECT * FROM orders WHERE id=:id", { id: result.insertId });

        // Generate KHQR only for QR payment method
        let qrResponse = null;
        if ((order.payment_method || "").toUpperCase() === "QR") {
            const orderTotal = currentOrder[0].total_amount;
            const expirationTimestamp = Date.now() + 3 * 60 * 1000;

            const individualInfo = new IndividualInfo(
                BAKONG.ACCOUNT_ID,
                BAKONG.ACCOUNT_NAME,
                BAKONG.CITY,
                {
                    currency: khqrData.currency.usd,
                    amount: orderTotal,
                    expirationTimestamp
                }
            );
            const khqr = new BakongKHQR();
            const qrData = khqr.generateIndividual(individualInfo);

            // Insert into payment_orders (initially without Bakong settlement fields; will be updated after check)
            await db.query(`
                INSERT INTO payment_orders (
                    order_id, qr, md5, expiration, created_at, status, currency, amount, description, paid
                )
                VALUES (:order_id, :qr, :md5, :expiration, NOW(), 'pending', 'USD', :amount, :description, 0)
                ON DUPLICATE KEY UPDATE
                    qr = VALUES(qr),
                    md5 = VALUES(md5),
                    expiration = VALUES(expiration),
                    status = 'pending',
                    currency = 'USD',
                    amount = VALUES(amount),
                    description = VALUES(description),
                    paid = 0
            `, {
                order_id: result.insertId,
                qr: qrData.data.qr,
                md5: qrData.data.md5,
                expiration: expirationTimestamp,
                amount: orderTotal,
                description: `POS Order ${currentOrder[0].order_no}`
            });

            qrResponse = {
                qr: qrData.data.qr,
                md5: qrData.data.md5,
                expiresAt: expirationTimestamp,
                payment_status: "pending"
            };
        }

        res.json({
            order: currentOrder[0],
            order_details,
            ...(qrResponse || {}),
            message: "Insert success!"
        });

    } catch (error) {
        logErr("order.create", error, res);
    }
};

// //fix newOrderNo
const newOrderNo = async () => {
    try {
        var sql =
            "SELECT " +
            "CONCAT('INV-',LPAD((SELECT COALESCE(MAX(id),0) + 1 FROM orders), 3, '0')) " +
            "as order_no";
        var [data] = await db.query(sql);
        return data[0].order_no;
    }
    catch (error) {
        // You should not pass `res` here, as this is a utility function.
        // It should throw the error for the calling function to handle.
        console.error("Error generating new order number:", error);
        throw error; // Re-throw the error
    }
};

exports.update = async (req, res) => {
    try {
        var sql = "update orders set order_no=:order_no, customer_id=:customer_id, total_amount=:total_amount, paid_amount=:paid_amount, payment_method=:payment_method, remark=:remark, user_id=:user_id, create_by=:create_by where id=:id";
        // var sql =
        // "UPDATE  order set name=:name, code=:code, tel=:tel, email=:email, address=:address, website=:website, note=:note WHERE id=:id ";
        var [data] = await db.query(sql, {
            ...req.body,
        });
        res.json({
            data: data,
            message: "Update success!",
        });
    }
    catch (error) {
        logErr("order.update", error, res);
    }
};

exports.remove = async (req, res) => {
    try {
        var [list] = await db.query("DELETE FROM orders WHERE id = :id", {
            ...req.body,
        });
        res.json({
            data: list,
            message: "success"
        })
    }
    catch (error) {
        logErr("order.remove", error, res);
    }
};
