const {getlist} = require("../controller/config.controller");
const { validate_token } = require("../middleware/jwt_token");
const { logErr } = require("../util/logErr");

try{
    module.exports = (app) => {
        app.get("/api/config",validate_token(),getlist);
        // app.get("/api/stock/getstocklist",validate_token(),getstocklist);
    };
}
catch(err){
    logErr("config.route",err);
}