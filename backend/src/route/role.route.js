const {getlist,create,update,remove} = require("../controller/role.controller");
const { validate_token } = require("../middleware/jwt_token");
const { logErr } = require("../util/logErr");

try{
    module.exports = (app) => {
        app.get("/api/role",validate_token(),getlist);
        app.post("/api/role",validate_token(),create);
        app.put("/api/role",update);
        app.delete("/api/role",remove);
    }
}
catch(err){
    logErr("role.route", err);
}