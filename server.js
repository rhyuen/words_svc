const express = require("express");
const winston = require("winston");
const app = express();
const wrapAsync = require("./common/util.js");
const middleware = require("./common/middleware.js");
const unauthedRoutes = require("./routes/unauthedRoutes.js");
const Main = require("./controllers/unauthedController.js");
const wordRoutes = require("./routes/wordRoutes.js");

middleware(app);

app.use("/", unauthedRoutes);
app.use("/words", wordRoutes);
app.get("*", Main.notFound);


app.use((err, req, res, next) => {        
    winston.log("error", `'Words REST Service' caught an error: ${err}`);
    res.status(500).json({
        message: "Something went wrong.",
        date: new Date().toLocaleString(),
        error: err.message,
        code: err.httpStatusCode
    });    
});

module.exports = app;