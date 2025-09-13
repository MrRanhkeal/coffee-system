const { getlist, create, update, remove } = require("../controller/customer.controller");
const { validate_token } = require("../middleware/jwt_token");
const { logErr } = require("../util/logErr");

try {
    module.exports = (app) => {
        app.get("/api/customer",validate_token(), getlist);
        app.post("/api/customer", validate_token(), create);
        app.put("/api/customer", validate_token(), update);
        app.delete("/api/customer", validate_token(), remove);
    }
}
catch (err) {
    logErr("customer.route", err);
}
