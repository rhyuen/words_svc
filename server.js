const express = require("express");
const app = express();
const middleware = require("./common/middleware.js");
const logger = require("./common/logger.js");
const unauthedRoutes = require("./routes/unauthedRoutes.js");
const Main = require("./controllers/unauthedController.js");
const wordRoutes = require("./routes/wordRoutes.js");

middleware(app);

app.use("/", unauthedRoutes);
app.use("/words", wordRoutes);
app.get("*", Main.notFound);

app.use((err, req, res, next) => {        
    logger.error(`'Words REST Service' caught an error: ${err}`);
    res.status(500).json({
        message: "Something went wrong.",
        date: new Date().toLocaleString(),
        error: err.message,
        code: err.httpStatusCode
    });    
});

module.exports = app;