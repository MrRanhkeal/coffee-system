const { getlist, create, update, remove } = require("../controller/supplier.controller");
const { validate_token } = require("../middleware/jwt_token");
const { logErr } = require("../util/logErr");

try {
    module.exports = (app) => {
        app.get("/api/supplier",validate_token(), getlist);
        app.post("/api/supplier",validate_token(), create);
        app.put("/api/supplier",validate_token(), update);
        app.delete("/api/supplier",validate_token(), remove);
    }
}
catch (err) {
    logErr("supplier.route", err);
}
