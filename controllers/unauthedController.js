const wrapAsync = require("../common/util.js");

exports.index = wrapAsync(async (req, res) => {        
    res.status(200).json({
        route: "/",
        message: "Learn more about words on the WORDS REST SERVCIE",
        routes: "Routes available are /"
    });    
});

exports.notFound = wrapAsync(async (req, res, next) => {    
    res.status(404).json({
        date: new Date().toLocaleString(),
        route: "/notfound",
        message: "This route doesn't exist in the 'Words API Service'."
    });
});