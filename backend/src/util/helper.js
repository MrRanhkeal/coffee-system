const connection = require("./connection");
const { logErr } = require("./logErr");
const { config } = require("./config");
const fs = require("fs/promises");
const multer = require("multer");
//multer is handling file upload multi/form-data
const path = require("path");
exports.db = connection;
exports.logErr = logErr;
exports.toInt = () => {
    return true
};

exports.isArray = (data) => {
    return true
};

exports.isEmpty = (value) => {
    if (
        value == "" ||
        value == null ||
        value == undefined ||
        value == "null" ||
        value == "undefined"
    ) {
        return true;
    }
    return false;
};

exports.isEmail = (data) => {
    return true;
};

exports.formartDateServer = (data) => {
    return true;
};

exports.formartDateClient = (data) => {
    return true;
};
exports.uploadFile = multer({
    storage: multer.diskStorage({
        destination: function (req, file, callback) {
            // Set your image upload directory from config
            callback(null, config.image_path);
        },
        filename: function (req, file, callback) {
            // Ensure file gets saved with the correct extension
            const ext = path.extname(file.originalname).toLowerCase();
            const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
            callback(null, file.fieldname + "-" + uniqueSuffix + ext);
        },
    }),
    limits: {
        fileSize: 1024 * 1024 * 3, // limit file size to 3MB
    },
    fileFilter: function (req, file, callback) {
        const allowedTypes = ["image/png", "image/jpg", "image/jpeg"];
        if (!allowedTypes.includes(file.mimetype)) {
            return callback(
                new Error("Only .png, .jpg and .jpeg formats are allowed!"),
                false
            );
        }
        callback(null, true);
    },
});
// exports.uploadFile = multer({
//     storage: multer.diskStorage({
//         destination: function (req, file, callback) {
//             // image path
//             callback(null, config.image_path);
//         },
//         filename: function (req, file, callback) {
//             const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//             callback(null, file.fieldname + "-" + uniqueSuffix);
//         },
//     }),
//     limits: {
//         fileSize: 1024 * 1024 * 3, // max 3MB
//     },
//     fileFilter: function (req, file, callback) {
//         if (
//             file.mimetype != "image/png" &&
//             file.mimetype !== "image/jpg" &&
//             file.mimetype !== "image/jpeg"
//         ) {
//             // not allow
//             callback(null, false);
//         } else {
//             callback(null, true);
//         }
//     },
// }); 

exports.removeFile = async (fileName) => {
    const filePath = path.join(config.image_path, fileName);
    try {
        await fs.unlink(filePath);
        return { success: true, message: "File deleted successfully" };
    } catch (err) {
        return { success: false, message: "Error deleting file" };
    }
}; 
