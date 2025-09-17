const { logErr } = require("../util/logErr");
const { validate_token } = require("../middleware/jwt_token");
const { generateKHQRCode, checkPayment, getOrderInfo, forceComplete } = require("../controller/payment.controller");

try {
    module.exports = (app) => {
        app.post("/api/payment/khqr", validate_token(), generateKHQRCode);
        app.post("/api/payment/check", validate_token(), checkPayment);
        app.post("/api/payment/force", validate_token(), forceComplete);
        app.post("/api/order/:id", validate_token(), getOrderInfo);
    };
}
catch (err) {
    logErr("payment.route", err);
}

