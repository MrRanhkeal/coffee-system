const { logErr } = require("../util/logErr");
const {db, isArray, isEmpty } = require("../util/helper");

exports.getlist = async (req, res) => {
    try {
        const [customer] = await db.query("SELECT count(id) total from customers");
        //expense check
        const [expense] = await db.query(
            " SELECT SUM(amount) as total, count(id) total_expense FROM expenses " +
            " WHERE MONTH(expense_date) = MONTH(CURRENT_DATE) AND YEAR(expense_date) = YEAR(CURRENT_DATE) "
        );
        //and more data

        const [sale] = await db.query(
            "SELECT " +
            " CONCAT(CONVERT(SUM(r.total_amount),CHAR),'$')  total " +
            " ,count(r.id) total_order  " +
            " FROM orders r  " +
            " WHERE " +
            " MONTH(r.create_at) = MONTH(CURRENT_DATE)" +
            " AND YEAR(r.create_at) = YEAR(CURRENT_DATE)"
        );
        const [sale_summary_by_month] = await db.query(
            " SELECT " +
            "   DATE_FORMAT(MIN(r.create_at),'%M') title" +
            "   ,SUM(r.total_amount)  total" +
            " FROM orders r " +
            " WHERE" +
            "   YEAR(r.create_at) = YEAR(CURRENT_DATE)" +
            " GROUP BY " +
            "   MONTH(r.create_at) "
        );
        const [expense_summary_by_month] = await db.query(
            " SELECT " +
            "   DATE_FORMAT(MIN(e.expense_date),'%M') title" +
            "   ,SUM(e.amount)  total" +
            " FROM expenses e " +
            " WHERE" +
            "   YEAR(e.expense_date) = YEAR(CURRENT_DATE)" +
            " GROUP BY " +
            "   MONTH(e.expense_date) "
        );
        //and more data

        let dashboard = [
            {
                title: "Customer",
                summary: {
                    Total: customer[0].total,
                    Male: 10,
                    Femal: 12,
                },
            },
            {
                title: "Sale",
                summary: {
                    Sale: "This Month",
                    Total: sale[0].total,
                    Total_Order: sale[0].total_order,
                },
            },
            {
                title: "Expanse",
                summary: {
                    Expanse: "This Month",
                    Total: expense[0].total + "$",
                    Total_Expense: expense[0].total_expense,
                },
            },
        ]
        res.json({
            data: dashboard,
            sale: sale_summary_by_month,
            expense: expense_summary_by_month,
            message: "success",
            error: false
        })
    }
    catch (err) {
        logErr("dashboard.getlist", err, res);
    }
}
