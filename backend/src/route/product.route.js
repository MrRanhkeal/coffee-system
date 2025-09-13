const { getlist, create, update, remove } = require("../controller/product.controller");
const { logErr } = require("../util/logErr");
const { uploadFile } = require("../util/helper")
const { validate_token } = require("../middleware/jwt_token");
const checkPermission = require("../middleware/checkPermission");
try {
    module.exports = (app) => {
        app.get("/api/product", validate_token(), getlist);
        // Route: Upload new product
        app.post(
            "/api/product", validate_token(), uploadFile.fields([
                { name: "upload_image", maxCount: 1 }, 
            ]), (req, res, next) => {
                if (!req.files || !req.files.upload_image) {
                    return res.status(400).json({ message: "upload_image is required" });
                }
                next();
            },
            create
        ); 
        app.put(
            "/api/product",validate_token(), uploadFile.fields([
                { name: "upload_image", maxCount: 1 }, 
            ]), (req, res, next) => {
                // Optional: only validate if image is present
                if (req.files && req.files.upload_image && req.files.upload_image.length > 0) {
                    // add logic to delete the old image here if needed 
                }
                next();
            },
            update
        );
        // app.post("/api/product", validate_token(), uploadFile.fields([
        //     { name: "upload_image", maxCount: 1 },
        //     // { name: "upload_image_optional", maxCount: 4 }
        // ]), create);
        // app.put("/api/product",validate_token(),uploadFile.fields([
        //     { name: "upload_image", maxCount: 1 },
        //     // { name: "upload_image_optional", maxCount: 4 }
        // ]), update);
        app.delete("/api/product", validate_token(), remove);
        // app.post("/api/new_barcode",validate_token(),newBarcode);
        // app.get("/api/product_image/:prodcut_id",validate_token(),productImage);

        //permission
        app.get("/", checkPermission("product"), (req, res) => {
            res.status(200).json({ message: "You have permission to access this route." });
        }
        );
    };
}
catch (err) {
    logErr("product.route", err);
}