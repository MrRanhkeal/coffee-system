const {db, logErr} = require("../util/helper");

exports.getlist = async (req, res) => {
    try {
        var [list] = await db.query("SELECT * FROM roles");
        res.json({
            data:list,
            message:"success"
        })
    } 
    catch (error) {
        logErr("role.getlist",error,res);
    }
};
exports.create = async (req, res) => {
    try {
        const { name, permission } = req.body;
        // normalize permission to valid JSON for MySQL JSON column
        let normalizedPermission = null;
        if (permission !== undefined && permission !== null) {
            if (typeof permission === 'string') {
                try {
                    // if it's a valid JSON string, keep as is
                    JSON.parse(permission);
                    normalizedPermission = permission;
                } catch {
                    // wrap plain string like 'all' into JSON string
                    normalizedPermission = JSON.stringify(permission);
                }
            } else {
                normalizedPermission = JSON.stringify(permission);
            }
        }
        const params = { name, permission: normalizedPermission };
        var sql = "INSERT INTO roles(name, permission) VALUES(:name, :permission)";
        var [result] = await db.query(sql, params);
        res.json({
            data:{ id: result.insertId },
            message:"success"
        })
    } 
    catch (error) {
        logErr("role.create",error,res);
    }
};
exports.update = async (req, res) => {
    try {
        const { id, name, permission } = req.body;
        if (!id) {
            return res.status(400).json({ error: true, message: "id is required" });
        }
        const updates = [];
        const params = { id };
        if (name !== undefined) {
            updates.push("name = :name");
            params.name = name;
        }
        if (permission !== undefined) {
            updates.push("permission = :permission");
            if (permission === null) {
                params.permission = null;
            } else if (typeof permission === 'string') {
                try {
                    JSON.parse(permission);
                    params.permission = permission; // already JSON doc
                } catch {
                    params.permission = JSON.stringify(permission); // wrap plain string
                }
            } else {
                params.permission = JSON.stringify(permission);
            }
        }
        if (updates.length === 0) {
            return res.status(400).json({ error: true, message: "No fields to update" });
        }
        var sql = `UPDATE roles SET ${updates.join(", ")} WHERE id = :id`;
        var [result] = await db.query(sql, params);
        res.json({
            data: result,
            message:"success"
        })
    } 
    catch (error) {
        logErr("role.update",error,res);
    }
};
exports.remove = async (req, res) => {
    try {
        var sql = "delete from roles where id=:id";
        var [list] = await db.query(sql,req.body);
        res.json({
            data:list,
            message:"success"
        })
    } 
    catch (error) {
        logErr("role.remove",error,res);
    }
};

