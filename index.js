const server = require("./server.js");
const logger = require("./common/logger.js");
const PORT = 9774;

process.on("uncaughtException", (err) => {    
    console.log("Uncaught Exception");
    logger.err(err);
    process.exit(1);    
});

server.listen(PORT, (err) => {    
    if(err) {
        return console.log(err);    
    }
    console.log(`Words REST Service on PORT: ${PORT}`);        
});