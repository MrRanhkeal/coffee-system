// const e = require("express");
const { db, isArray, isEmpty, logErr } = require("../util/helper");

exports.getList = async (req, res) => {
    try {
        var txtSearch = req.query.txtSearch;
        var sql = "SELECT * FROM expenses ";
        if (!isEmpty(txtSearch)) {
            sql += " WHERE expense_type LIKE :txtSearch";
        }
        const [list] = await db.query(sql, {
            txtSearch: "%" + txtSearch + "%",
        });
        res.json({
            list: list,
        });
    } catch (error) {
        logErr("expense.getList", error, res);
    }
};
exports.create = async (req, res) => {
    try {
        const { expense_type,vendor_payee, amount, payment_method } = req.body;
        if (isEmpty(expense_type) || isEmpty(amount) || isEmpty(vendor_payee) || isEmpty(payment_method)) {
            return res.status(400).json({ status: "error", message: "Invalid input" });
        }
        var sqlInsert = "INSERT INTO expenses (expense_type,vendor_payee,amount,payment_method,description,create_by) values(?,?,?,?,?,?)";
        var [data] = await db.query(sqlInsert, [
            req.body.expense_type,
            req.body.vendor_payee,
            req.body.amount,
            req.body.payment_method || null, // Optional field
            req.body.description || null, // Optional field
            //req.body.expense_date || null, // Optional field
            req.auth?.name 
        ]);
        res.json({
            data: data,
            message: "Insert success!",
        });
    } catch (error) {
        logErr("expense.create", error, res);
    }
};

exports.update = async (req, res) => {
    try {
        const {id, expense_type,vendor_payee, amount, payment_method, description } = req.body;
        if (isEmpty(expense_type) || isEmpty(amount) || isEmpty(vendor_payee) || isEmpty(payment_method)) {
            return res.status(400).json({ status: "error", message: "Invalid input" });
        }
        var sqlupdate = "update expenses set expense_type=:expense_type,vendor_payee=:vendor_payee,amount=:amount,payment_method=:payment_method,description=:description where id=:id";
        var [data] = await db.query(sqlupdate, {
            expense_type,
            vendor_payee,
            amount,
            payment_method,
            description,
            id
        });
        if (data.affectedRows > 0) {
            res.json({
                data: data,
                message: "Update success!",
            });
        } else {
            res.json({
                data: data,
                message: "Data not found!",
            });
        }
    } catch (error) {
        logErr("expense.update", error, res);
    }
};

exports.remove = async (req, res) => {
    try {
        var [data] = await db.query("DELETE FROM expenses WHERE id = :id", {
            ...req.body,
        });
        res.json({
            data: data,
            message: "Data delete success!",
        });
    } catch (error) {
        logErr("expense.remove", error, res);
    }
};
exports.getexpense_summary = async (req, res) => {
    try {
        const [expense_month] = await db.query( 
            `SELECT 
                YEAR(e.create_at) as year, 
                MONTH(e.create_at) as month,
                SUM(e.amount) as expense_per_month
            FROM expenses e 
            WHERE YEAR(e.create_at) = YEAR(CURRENT_DATE) 
            GROUP BY YEAR(e.create_at), MONTH(e.create_at)
            ORDER BY YEAR(e.create_at) DESC, MONTH(e.create_at) DESC;`
        );
        const [expense_this_month] = await db.query(
            `SELECT 
                YEAR(e.create_at) AS year,
                MONTH(e.create_at) AS month,
                SUM(e.amount) AS expense_this_month
            FROM expenses e
            WHERE 
                YEAR(e.create_at) = YEAR(CURRENT_DATE)
                AND MONTH(e.create_at) = MONTH(CURRENT_DATE)
            GROUP BY YEAR(e.create_at), MONTH(e.create_at);`
        );
        const [expense_last_month] = await db.query(
            `SELECT 
                YEAR(e.create_at) AS year,
                MONTH(e.create_at) AS month,
                SUM(e.amount) AS expense_last_month
            FROM expenses e
            WHERE 
                YEAR(e.create_at) = YEAR(CURRENT_DATE - INTERVAL 1 MONTH)
                AND MONTH(e.create_at) = MONTH(CURRENT_DATE - INTERVAL 1 MONTH)
            GROUP BY YEAR(e.create_at), MONTH(e.create_at);`
        );
        const [expense_year] = await db.query( 
            `SELECT 
                YEAR(e.create_at) as year, 
                SUM(e.amount) as expense_per_year
            FROM expenses e 
            WHERE YEAR(e.create_at) = YEAR(CURRENT_DATE) 
            GROUP BY YEAR(e.create_at)
            ORDER BY YEAR(e.create_at) DESC;`
        );
        const [expense_this_year] = await db.query(
            `SELECT 
                SUM(e.amount) AS expense_this_year
                FROM expenses e
                WHERE 
                YEAR(e.create_at) = YEAR(CURRENT_DATE);`
        );
        const [total_expense] = await db.query(
            `SELECT 
                SUM(expense) AS total_expense
            FROM (
                SELECT SUM(e.amount) AS expense
                FROM expenses e
                WHERE 
                    (YEAR(e.create_at) = YEAR(CURRENT_DATE) AND MONTH(e.create_at) = MONTH(CURRENT_DATE))
                    OR
                    (YEAR(e.create_at) = YEAR(CURRENT_DATE - INTERVAL 1 MONTH) AND MONTH(e.create_at) = MONTH(CURRENT_DATE - INTERVAL 1 MONTH))
            ) AS monthly_expenses;`
        );
        res.json({
            expense_month: expense_month,
            expense_this_month: expense_this_month,
            expense_last_month: expense_last_month,
            expense_year: expense_year,
            expense_this_year: expense_this_year,
            total_expense: total_expense
        });
    } catch (error) {
        logErr("expense.getexpense_summary", error, res);
    }
}; 
