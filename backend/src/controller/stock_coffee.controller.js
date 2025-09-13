const { db, logErr, isEmpty, isArray } = require('../util/helper');

exports.getlist = async (req, res) => {
    try {

        var [data] = await db.query('SELECT * FROM stock_coffee ORDER BY id desc');
        res.json({
            // data: result.rows, 
            data: data,
            status: 'success',
        });
    } catch (err) {
        logErr("stock_coffee.getlist", err);
    }
}

exports.create = async (req, res) => {
    try {
        const { product_name, qty } = req.body;
        if (isEmpty(product_name) || isEmpty(qty)) {
            return res.status(400).json({ status: 'error', message: 'Invalid input' });
        }

        const sqlInsert = "INSERT INTO stock_coffee (product_name, categories, supplier_id, qty,cost,description,status) values(?,?,?,?,?,?,?)";
        //values ($1, $2, $3, $4, $5) RETURNING *
        //RETURNING * for return values from rows affected by insert updata or deleted 
        const data = await db.query(sqlInsert, [
            req.body.product_name,
            req.body.categories,
            req.body.supplier_id,
            req.body.qty,
            req.body.cost,
            req.body.description || null, // Optional field
            req.body.status || null, // Optional field
        ]);
        res.status(200).json({
            // data: result.rows[0]
            data: data,
            status: 'success',
            message: 'Coffee stock created successfully'
        });
    } catch (err) {
        logErr("stock_coffee.create", err);
    }
}

exports.update = async (req, res) => {
    try {
        const { id, product_name, categories, qty, cost, supplier_id, description, status } = req.body;
        if (isEmpty(id) || isEmpty(product_name) || isEmpty(qty)) {
            return res.status(400).json({ status: 'error', message: 'Invalid input' });
        }

        const sqlUpdate = "UPDATE stock_coffee SET product_name = ?, categories = ?, supplier_id = ?, qty = ?, cost = ?, description = ?, status = ? WHERE id = ?";
        const [result] = await db.query(sqlUpdate, [
            product_name,
            categories,
            supplier_id || null,
            qty,
            cost,
            description || null,
            status || null,
            id
        ]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ status: 'error', message: 'Coffee not found' });
        }

        res.json({
            status: 'success',
            data: { id, product_name, qty, supplier_id, cost, description, status },
            message: 'Coffee stock updated successfully'
        });
    } catch (err) {
        logErr("stock_coffee.controller.update", err);
        res.status(500).json({ status: 'error', message: 'Failed to update stock coffee' });
    }
};

exports.remove = async (req, res) => {
    try {
        const sqlDelete = "DELETE FROM stock_coffee WHERE id=?";
        var [data] = await db.query(sqlDelete, [req.body.id]);

        res.json({
            data: data,
            message: "Stock coffee deleted successfully"
        });
    } catch (error) {
        logErr("stock_coffee.remove", error, res);
    }
};

exports.total_cost = async (req, res) => {
    try {
        const [total_cost] = await db.query(
            `SELECT  
                SUM(qty * cost) AS total_cost
            FROM stock_coffee 
            ORDER BY total_cost DESC;`
        );
        res.json({
            status: 'success',
            total_cost: total_cost,
        });
    } catch (err) {
        logErr("stock_coffee.total_cost", err);
        res.status(500).json({ status: 'error', message: 'Failed to calculate total cost' });
    }
}

