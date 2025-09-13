const { logErr, db, removeFile } = require("../util/helper");

exports.getlist = async (req, res) => {
    try {
        var { txt_search, category_id, brand, page, is_list_all } = req.query;

        const pageSize = 10; // Items per page

        // Ensure that 'page' is a valid number and default it to 1 if not
        page = Number(page);
        if (isNaN(page) || page < 1) {
            page = 1;
        }

        const offset = (page - 1) * pageSize; // Calculate offset

        // Build base SQL
        var sqlSelect = "SELECT p.*, c.name AS category_name";
        var sqlJoin = " FROM products p INNER JOIN category c ON p.category_id = c.id";
        var sqlWhere = " WHERE true";

        // Apply filters
        if (txt_search) {
            sqlWhere += " AND (p.name LIKE :txt_search)";
        }
        if (category_id) {
            sqlWhere += " AND p.category_id = :category_id";
        }
        if (brand) {
            sqlWhere += " AND p.brand = :brand";
        }

        // Add ORDER BY clause
        var sqlOrder = " ORDER BY p.id DESC";

        // Add pagination unless is_list_all is set
        var sqlLimit = is_list_all ? "" : " LIMIT " + pageSize + " OFFSET " + offset;

        // Final SQL query
        var sqlList = sqlSelect + sqlJoin + sqlWhere + sqlOrder + sqlLimit;

        // SQL parameters
        var sqlparam = {
            txt_search: txt_search ? "%" + txt_search + "%" : undefined,
            category_id,
            brand,
        };

        // Execute product list query
        const [list] = await db.query(sqlList, sqlparam);

        // Count total only for the first page
        var dataCount = 0;
        if (page === 1 && !is_list_all) {
            let sqlTotal = "SELECT COUNT(p.id) as total" + sqlJoin + sqlWhere;
            var [dataCountResult] = await db.query(sqlTotal, sqlparam);
            dataCount = dataCountResult[0].total;
        }

        // Get product details for all products in the list
        res.json({
            list: list,
            total: dataCount,
        });
    } catch (error) {
        logErr("product.getList", error, res);
    }
};
exports.create = async (req, res) => {
    try {
        var sql =
            " INSERT INTO products (category_id, name,brand,description,price,discount,status,image,create_by ) " +
            " VALUES (:category_id, :name, :brand, :description,  :price, :discount, :status, :image, :create_by ) ";
        const image = req.files?.upload_image?.[0]?.filename || null;

        const [data] = await db.query(sql, {
            ...req.body,
            image: image,
            create_by: req.auth?.name
        });

        res.json({
            data,
            message: "Product created successfully",
            error: false
        });
        // var [data] = await db.query(sql, {
        //     ...req.body,
        //     image: req.files?.upload_image[0]?.filename,
        //     create_by: req.auth?.name,
        // });
        // res.json({
        //     data: data,
        //     message: "success",
        //     error: false
        // })
    }
    catch (error) {
        logErr("category.create", error, res);
    }
};
exports.update = async (req, res) => {
    try {
        var sql =
            " UPDATE products set " +
            " category_id = :category_id, " +
            // " barcode = :barcode, " +
            " name = :name, " +
            " brand = :brand, " +
            " description = :description, " +
            // " qty = :qty, " +
            " price = :price, " +
            " discount = :discount, " +
            " status = :status, " +
            " image = :image " +
            " WHERE id = :id";

        var filename = req.body.image;
        /// image new
        if (req.files?.upload_image) {
            filename = req.files?.upload_image[0]?.filename;
        }
        // image change
        if (
            req.body.image != "" &&
            req.body.image != null &&
            req.body.image != "null" &&
            req.files?.upload_image
        ) {
            removeFile(req.body.image); // remove old image
            filename = req.files?.upload_image[0]?.filename;
        }
        // image remove
        if (req.body.image_remove == "1") {
            removeFile(req.body.image); // remove image
            filename = null;
        }

        var [data] = await db.query(sql, {
            ...req.body,
            image: filename,
            create_by: req.auth?.name
        });
        
        res.json({
            data: data,
            message: "success",
            error: false
        })
    }
    catch (error) {
        logErr("product.update", error, res);
    }
};

exports.remove = async (req, res) => {
    try {
        var [data] = await db.query("DELETE FROM products WHERE id = :id", {
            id: req.body.id //null data
        });
        if (data.affectedRows && req.body.image != "" && req.body.image != null) {
            removeFile(req.body.image);
        }
        res.json({
            data: data,
            message: "deleted successfully",
            error: false
        })
    }
    catch (error) {
        logErr("remove.create", error, res);
    }
};
