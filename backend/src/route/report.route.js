const { validate_token } = require("../middleware/jwt_token");
const {getSalereport,get_sale_summary,getExpenseReport,getStockReport,getProductReport} = require("../controller/report.controller");
const { logErr } = require("../util/logErr"); 
try {
    module.exports = (app) => { 
        app.get("/api/report/getsalereport", validate_token(), getSalereport); 
        app.get("/api/report/get_sale_summary", validate_token(), get_sale_summary);
        app.get("/api/report/expense_report", validate_token(), getExpenseReport);
        app.get("/api/report/stock_report", validate_token(), getStockReport);
        app.get("/api/report/product_report", validate_token(), getProductReport);
    };
}
catch (error) {
    logErr(error, "report.route.js");
}
