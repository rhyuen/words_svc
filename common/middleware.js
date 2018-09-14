const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const config = require("../config.js");
const logger = require("./logger.js");

module.exports = (app) => {    
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(morgan("dev")); 
    mongoose.connection.openUri(config.getSecrets().db, {useNewUrlParser: true})
        .once("open",  () => {            
            logger.info("DB Connection OPEN.");
        }).on("error", e => {            
            logger.error(`MONGODB ERROR: ${e}`);
        });
    app.use(cookieParser(config.getSecrets().cookieSecret, {
        httpOnly: true,
        maxAge: 3600
    }));   
};