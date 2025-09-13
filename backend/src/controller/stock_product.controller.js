const { db, logErr,isEmpty } = require("../util/helper");

exports.getlist = async (req, res) => {
    try {

        var [data] = await db.query("SELECT * FROM stock_product ORDER BY id DESC");
        res.json({
            data: data,
            message: "success"
        });
    } catch (error) {
        logErr("stock_product.getlist", error, res);
    }

};

//create
exports.create = async (req, res) => {
    try {
        const { name_product, qty } = req.body;
        if (isEmpty(name_product) || isEmpty(qty)) {
            return res.status(400).json({ status: 'error', message: 'Invalid input' });
        }
        const sqlInsert = "insert into stock_product (name_product,qty,supplier_id,description,cost,brand_name,status,create_by) values(?,?,?,?,?,?,?,?)";
        const data = await db.query(sqlInsert, [
            req.body.name_product,
            req.body.qty,
            req.body.supplier_id,
            req.body.description,
            req.body.cost,
            req.body.brand_name,
            req.body.status,
            req.auth?.name
        ]);

        res.status(200).json({
            data: data,
            status: "success",
            message: "Product Stock inserted successfully"
        });
    }
    catch (error) {
        logErr("stock_product.create", error, res);
    }
};
exports.update = async (req, res) => {
    try {
        const { id, name_product, qty, cost, supplier_id, description, brand_name, status } = req.body;
        if (isEmpty(id) || isEmpty(name_product) || isEmpty(qty) || isEmpty(cost) || isEmpty(supplier_id) || isEmpty(brand_name)) {
            return res.status(400).json({ status: 'error', message: 'Invalid input' });
        }
        const sqlUpdate = "UPDATE stock_product SET name_product = ?, qty = ?, supplier_id = ?, description = ?, cost = ?, brand_name = ?, status = ? WHERE id = ?";
        const [data] = await db.query(sqlUpdate, [
            name_product,
            qty,
            supplier_id,
            description,
            cost,
            brand_name,
            status,
            id
        ]);
        if(data.affectedRows === 0) {
            return res.status(404).json({ status: 'error', message: 'Product not found' });
        }
        res.json({
            data: data,
            status: 'success',
            message: "Stock updated successfully"
        });
    } catch (error) {
        logErr("stock_product.update", error, res);
        res.status(500).json({
            status: 'error',
            message: 'Failed to update stock product'
        });
    }
}
exports.remove = async (req, res) => {
    try {
        const sqlDelete = "DELETE FROM stock_product WHERE id=?";
        var [data] = await db.query(sqlDelete, [req.body.id]);

        res.json({
            data: data,
            message: "Stock deleted successfully"
        });
    } catch (error) {
        logErr("stock_product.remove", error, res);
    }
};

exports.total_cost = async (req, res) => {
    try {
        const [total_cost] = await db.query(
            `SELECT  
                SUM(qty * cost) AS total_cost
            FROM stock_product 
            ORDER BY total_cost DESC;`
        );
        res.json({
            status: 'success',
            total_cost: total_cost,
        });
    } catch (err) {
        logErr("stock_product.total_cost", err);
        res.status(500).json({ status: 'error', message: 'Failed to calculate total cost' });
    }
}