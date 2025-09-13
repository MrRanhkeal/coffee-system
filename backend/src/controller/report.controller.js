const { db, logErr, isArray, isEmpty } = require("../util/helper");

exports.getSalereport = async (req, res) => {
    try {
        const from_date = req.query.from_date;
        const to_date = req.query.to_date;
        let sqlgetSale =
            "SELECT " +
            " o.order_no, " +
            " o.create_at AS order_date, " +
            " o.total_amount, " +
            " o.paid_amount," +
            " o.payment_method, " +
            " c.name AS customer_name, " +
            " u.name AS user_name, " +
            " p.name AS product_name, " +
            " od.qty, " +
            " od.price AS product_price_at_order, " +
            " od.discount AS order_detail_discount, " +
            " od.total AS order_detail_total, " +
            " p.brand AS product_brand " +
            " FROM orders o " +
            " JOIN order_detail od ON o.id = od.order_id " +
            " JOIN products p ON od.product_id = p.id " +
            " LEFT JOIN customers c ON o.customer_id = c.id " +
            " LEFT JOIN users u ON o.user_id = u.id WHERE 1=1 ";

        let sqlParam = {};
        if (!isEmpty(from_date) && !isEmpty(to_date)) {
            sqlgetSale += " AND DATE_FORMAT(o.create_at,'%Y-%m-%d') BETWEEN :from_date AND :to_date ";
            sqlParam.from_date = from_date;
            sqlParam.to_date = to_date;
        }
        let sqlOrderBy = " ORDER BY o.create_at DESC ";
        if (req.query.order_by === "desc") {
            sqlOrderBy = " ORDER BY o.create_at DESC ";
        } else if (req.query.order_by === "asc") {
            sqlOrderBy = " ORDER BY o.create_at ASC ";
        }
        // const [list] = await db.query(sqlgetSale, [from_date, to_date]);
        const [list] = await db.query(sqlgetSale + sqlOrderBy, sqlParam);
        // Group by product_brand, order_no, product_name and sum qty
        const grouped = [];
        const keyMap = {};
        for (const item of list) {
            const key = `${item.product_brand}__${item.order_no}__${item.product_name}`;
            if (!keyMap[key]) {
                keyMap[key] = { ...item };
                keyMap[key].qty = Number(item.qty) || 0;
                grouped.push(keyMap[key]);
            } else {
                keyMap[key].qty += Number(item.qty) || 0;
            }
        }
        // After grouping, set order_detail_total as qty * product_price_at_order
        for (const g of grouped) {
            g.order_detail_total = g.qty * (Number(g.product_price_at_order) || 0);
        }

        res.json({
            list: grouped,
            message: "success"
        });
    }
    catch (err) {
        logErr("report.getSalereport", err, res);
    }
};
exports.get_sale_summary = async (req, res) => {
    try {
        const [sale] = await db.query(
            "SELECT " +
            " CONCAT(CONVERT(SUM(o.total_amount),CHAR),'$')  total " +
            " ,count(o.id) total_order  " +
            " FROM orders o  " +
            " WHERE " +
            " MONTH(o.create_at) = MONTH(CURRENT_DATE)" +
            " AND YEAR(o.create_at) = YEAR(CURRENT_DATE)"
        );
        const [sale_summary_by_month_raw] = await db.query(
            `SELECT 
                YEAR(o.create_at) as year, 
                MONTH(o.create_at) as month, 
                SUM(o.total_amount) as total 
                FROM orders o 
                WHERE YEAR(o.create_at) = YEAR(CURRENT_DATE) 
                GROUP BY YEAR(o.create_at), MONTH(o.create_at)`
        );
        const [summary_per_year] = await db.query(
            "SELECT " +
            " YEAR(o.create_at) AS year, " +
            " SUM(o.total_amount) AS total_per_year " +
            " from orders o " +
            " where YEAR(o.create_at) = YEAR(CURRENT_DATE) " +
            " GROUP by YEAR(o.create_at) "
        );
        const [summary_per_day] = await db.query(
            `SELECT
                    DATE(o.create_at) AS date,
                    SUM(o.total_amount) AS total_per_day
                from orders o
                WHERE YEAR(o.create_at) = YEAR(CURRENT_DATE)
                GROUP BY DATE(o.create_at)
                ORDER BY date desc;`
        );
        const [summary_per_week] = await db.query(
            `SELECT 
                DATE_FORMAT(MIN(o.create_at), '%Y-%m-%d') AS week_start_date,
                    YEAR(o.create_at) AS year,
                    WEEK(o.create_at, 1) AS week_number, 
                    SUM(o.total_amount) AS total_per_week
                FROM orders o
                WHERE YEAR(o.create_at) = YEAR(CURRENT_DATE)
                GROUP BY YEAR(o.create_at), WEEK(o.create_at, 1)
                ORDER BY YEAR(o.create_at) DESC, WEEK(o.create_at, 1) DESC;`
        );
        const [this_week] = await db.query(
            `SELECT 
                    YEAR(o.create_at) AS year,
                    WEEK(o.create_at, 1) AS week_number, 
                    SUM(o.total_amount) AS total_this_week
                FROM orders o
                WHERE 
                    YEAR(o.create_at) = YEAR(CURRENT_DATE)
                    AND WEEK(o.create_at, 1) = WEEK(CURRENT_DATE, 1)
                GROUP BY 
                    YEAR(o.create_at), 
                    WEEK(o.create_at, 1)
                ORDER BY 
                    YEAR(o.create_at) DESC, 
                    WEEK(o.create_at, 1) DESC;`
        );
        const [last_week] = await db.query(
            `SELECT 
                    DATE_FORMAT(MIN(o.create_at), '%Y-%m-%d') AS week_start_date,
                    YEAR(o.create_at) AS year,
                    WEEK(o.create_at, 1) AS week_number,
                    SUM(o.total_amount) AS total_last_week
                FROM orders o
                WHERE 
                    YEAR(o.create_at) = YEAR(CURRENT_DATE - INTERVAL 1 WEEK)
                    AND WEEK(o.create_at, 1) = WEEK(CURRENT_DATE - INTERVAL 1 WEEK, 1)
                GROUP BY 
                    YEAR(o.create_at), 
                    WEEK(o.create_at, 1)
                ORDER BY 
                    year DESC, 
                    week_number DESC;`
        );
        const [summary_last_month] = await db.query(
            `SELECT 
                YEAR(o.create_at) AS year,
                MONTH(o.create_at) AS month,
                SUM(o.total_amount) AS total
                FROM orders o
                WHERE 
                    o.create_at >= DATE_FORMAT(CURRENT_DATE - INTERVAL 1 MONTH, '%Y-%m-01')
                    AND o.create_at < DATE_FORMAT(CURRENT_DATE, '%Y-%m-01')
                GROUP BY 
                    YEAR(o.create_at), 
                    MONTH(o.create_at);`
        );
        const [income] = await db.query(
            " SELECT " +
            " SUM(o.total_amount) AS total_income FROM orders o "
        );
        // Build an object for the current year with each month's total (0 if missing)
        const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
        let year = new Date().getFullYear();
        let summaryRow = { year, currency: 'USD' };
        months.forEach((m) => summaryRow[m] = '0.00$');
        sale_summary_by_month_raw.forEach(row => {
            const idx = row.month - 1;
            if (idx >= 0 && idx < 12) {
                summaryRow[months[idx]] = `${Number(row.total).toFixed(2)}$`;
            }
        });
        // Optionally, add a 'Month' column for display
        summaryRow['month'] = year;
        const sale_summary_by_month = [summaryRow];
        const summary_month = [
            {
                title: "Sale",
                summary: {
                    Sale: "This Month",
                    Total: sale[0].total,
                    Total_Order: sale[0].total_order,
                    currency: 'USD',
                },
            }
        ];
        res.json({
            sale: sale,
            summary_per_day: summary_per_day,
            summary_per_week: summary_per_week[0],
            this_week: this_week[0],
            last_week: last_week[0],
            summary_month: summary_month,
            summary_last_month: summary_last_month[0],
            sale_summary_by_month: sale_summary_by_month,
            summary_per_year: summary_per_year,
            income: income[0].income,
            message: "success"
        });
    }
    catch (err) {
        logErr("report.get_sale_summary", err, res);
    }
};
