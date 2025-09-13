const {getlist,create,update,remove} = require("../controller/category.controller");
const { logErr } = require("../util/logErr");
const {validate_token} = require("../middleware/jwt_token");
//const { admin } = require("../middleware/auth/admin");

try{
    module.exports = (app) => {
        app.get("/api/category",validate_token(),getlist);
        app.post("/api/category",create); //test admin
        app.put("/api/category",update);
        app.delete("/api/category",remove);
    }
}
catch(err){
    logErr("category.route",err);
}