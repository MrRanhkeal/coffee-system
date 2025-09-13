// const fs = require("fs/promises");
// const moment = require("moment-timezone");
// exports.logErr = async (controller,mess_err,res) => {
//     try{
//         const ofset = moment().tz("UTC+7").format("YYYY-MM-DD HH:mm:ss z"); // Replace 'UTC' with your desired timezone (e.g., 'America/New_York')
//         const path = "./logs/" + controller + ".txt";
//         //const logMessage = `${mess_err} - ${timestamp}\n`;
//         const logMessage = mess_err + " + " + ofset +  "\n";
//         await fs.appendFile(path,logMessage);
//     }
//     catch(error){
//         console.log("Error writing to log file:", error);
//     }
//     res.status(500).send("Internal Server Error!");
// };
const fs = require("fs/promises");
const path = require("path");
const moment = require("moment-timezone");
const logErr = async (controller, mess_err, res = null) => {
    try {
        const offset = moment().tz("UTC+7").format("YYYY-MM-DD HH:mm:ss z");
        const logDir = path.join(__dirname, "../../logs");
        const logPath = path.join(logDir, `${controller}.txt`);

        // Create logs directory if it doesn't exist
        await fs.mkdir(logDir, { recursive: true }).catch(() => { });

        const logMessage = `${mess_err} + ${offset}\n`;
        await fs.appendFile(logPath, logMessage);
    }
    catch (error) {
        console.log("Error writing to log file:", error);
    }

    if (res && typeof res.status === 'function') {
        res.status(500).send("Internal Server Error!");
    }
};

module.exports = { logErr };