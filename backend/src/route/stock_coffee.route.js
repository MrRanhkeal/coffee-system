const { getlist, create, update, remove,total_cost } = require("../controller/stock_coffee.controller");
const { validate_token } = require("../middleware/jwt_token");
const { logErr } = require("../util/logErr");
try{
    module.exports = (app) => {
    app.get("/api/stock_coffee",validate_token(),getlist);
    app.get("/api/total_coffee_cost",validate_token(),total_cost);
    app.post("/api/stock_coffee",validate_token(),create);
    app.put("/api/stock_coffee",validate_token(),update);
    app.delete("/api/stock_coffee",validate_token(),remove);
}
}
catch(err){
    logErr("stock_coffee.route", err)
}
