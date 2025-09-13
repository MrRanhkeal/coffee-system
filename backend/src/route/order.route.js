const { logErr } = require("../util/logErr")
const {getlist,orderdetail,create,update,remove } = require("../controller/order.controller");
const { validate_token } = require("../middleware/jwt_token");

module.exports = (app) => {
    try{
        app.get("/api/order",validate_token(),getlist);
        app.get("/api/order_detail/:id",validate_token(),orderdetail); 
        app.post("/api/order",validate_token(),create);
        app.put("/api/order",update);
        app.delete("/api/order",remove);
    }
    catch(err){
        logErr("order.route", err)
    }
}