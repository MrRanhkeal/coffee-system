const { db, logErr, isArray, isEmpty } = require("../util/helper");

exports.getlist = async (req, res) => {
    try {
        var txtSearch = req.query.txtSearch;
        var sql = "SELECT * FROM customers ";
        if (!isEmpty(txtSearch)) {
            sql +=
                " WHERE name LIKE :txtSearch OR phone LIKE :txtSearch OR email LIKE :txtSearch";
        }
        const [list] = await db.query(sql, {
            txtSearch: "%" + txtSearch + "%",
        });
        res.json({
            list: list,
            message: "success"
        });
        
    }
    catch (error) {
        logErr("customer.getlist", error, res);
    }
};
exports.create = async (req, res) => {
    try {
        var sql = "insert into customers(name,phone,email,address,description,create_by,status) values(:name,:phone,:email,:address,:description,:create_by,:status)";
        var [list] = await db.query(sql, 
            {
                ...req.body,
                create_by: req.auth?.name,
                message: "Insert success!"

            });
        res.json({
            data: list,
            message: "success"
        })
    }
    catch (error) {
        logErr("customer.create", error, res);
    }
};
exports.update = async (req, res) => {
    try {
        var sql = "update customers set name=:name,phone=:phone,email=:email,address=:address,description=:description,create_by=:create_by, status=:status where id=:id";
        var [list] = await db.query(sql, {...req.body});
        res.json({
            data: list,
            message: "success"
        })
    }
    catch (error) {
        logErr("customer.update", error, res);
    }
};
exports.remove = async (req, res) => {
    try {
        var sql = "delete from customers where id=:id";
        var [list] = await db.query(sql, {...req.body});
        res.json({
            data: list,
            message: "success"
        })
    }
    catch (error) {
        logErr("customer.remove", error, res);
    }
};
