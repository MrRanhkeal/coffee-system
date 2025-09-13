const { validate_token } = require("../middleware/jwt_token");
const { logErr } = require("../util/logErr");
const {getlist} = require("../controller/dashboard.controller");
module.exports = (app) => {
    try{
        app.get("/api/dashboard", getlist);
    }
    catch(err){
        logErr("dashboard.route", err)
    }
};



