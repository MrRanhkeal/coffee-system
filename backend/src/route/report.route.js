const { validate_token } = require("../middleware/jwt_token");
const {getSalereport,get_sale_summary} = require("../controller/report.controller");
const { logErr } = require("../util/logErr"); 
try {
    module.exports = (app) => { 
        app.get("/api/report/getsalereport", validate_token(), getSalereport); 
        app.get("/api/report/get_sale_summary", validate_token(), get_sale_summary);
    };
}
catch (error) {
    logErr(error, "report.route.js");
}
