const express = require("express");
const fetch = require("node-fetch");
const wrapAsync = require("../common/util.js");
const Word = require("../models/word.js");
const {promisify} = require("util");
const jwt = require("jsonwebtoken");
const jwtVerify = promisify(jwt.verify);
const {extServices, secrets} = require("../config.js");
const router = express.Router();

async function useAuthService(req, res, next){    
    try{            
        if(!req.headers.authorization && !req.cookies['authservice_token']){
            console.log("No authorization header or no req.cookies['authservice_token'] %s", req.cookies['authservice_token']);        
            //TODO: if client is api, send error message
            //TODO: if client is browser, redirect.            
            return res.redirect(`${extServices().auth}/login`);            
        }                
        const authTokenForHeader = req.cookies["authservice_token"] || req.headers.authorization;
                
        const options = {
            method: "GET",
            headers: {"Authorization": `Bearer ${authTokenForHeader}`}        
        };
        
        const authRes = await fetch(`${extServices().auth}/auth`, options);
        console.log("Result Status: %s | Result redirected from %s", authRes.status, authRes.url);
        
        if(authRes.status === 400 || authRes.status === 401){
            const error = new Error("Credentials are not valid for access to this resource.");
            error.httpStatusCode = authRes.status;        
            throw error;
        }        
        next();        
    }catch(e){
        console.log("There was an error authorizing resources with the authz server.  Error: %s", e);                
        res.redirect(`${extServices().auth}/login`);
    }
}

async function isTokenAuthedToRscStandAlone(req, res, next){
    try{        
        if(!req.headers.authorization && !req.cookies["authservice_token"]){
            const error = new Error("No authorization header or no JWT in cookie.");
            error.status = 400;
            throw error;
        }                                
        
        const identityToValidate = req.cookies["authservice_token"] || req.headers.authorization.split(" ")[1];
        console.log(identityToValidate);
        const validationResult = await jwtVerify(identityToValidate, secrets().jwtSecret)
            .catch(e => {
                console.error("JWT token verification failed. Error: %s", e);            
            });                       
        console.log(validationResult);
        return next(); 
    }catch(e){
        console.log("There was an AuthZ Error\n %s", e);
        if(e.name === "JsonWebTokenError"){
            return res.status(401).json({
                message: "Wrong signature for your token.",
                error: e
            });
        }
        if(e.name === "TokenExpiredError"){
            return res.status(401).json({
                message: "You need to sign in. Your token is expired.",
                error: e
            });
        }                                         
        return res.status(401).json({
            message: "An unexpected case for your auth happened.",
            error: e
        });
    }    
}

//router.use(wrapAsync(useAuthService));
router.use(wrapAsync(isTokenAuthedToRscStandAlone));

router.get("/", wrapAsync(async(req, res) => {
    res.send("hello from the protected routes.");
}));

module.exports = router;