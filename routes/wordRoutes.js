const express = require("express");
const fetch = require("node-fetch");
const wrapAsync = require("../common/util.js");
const Word = require("../models/word.js");
const config = require("../config.js");
const router = express.Router();

async function useAuthService(req, res, next){    
    try{            
        if(!req.headers.authorization && !req.cookies['authservice_token']){
            console.log("No authorization header or no req.cookies['authservice_token'] %s", req.cookies['authservice_token']);        
            //TODO: if client is api, send error message
            //TODO: if client is browser, redirect.            
            return res.redirect(config.extServices().auth + "/login");            
        }                
        const authTokenForHeader = req.cookies["authservice_token"] || req.headers.authorization;
                
        const options = {
            method: "GET",
            headers: {"Authorization": `Bearer ${authTokenForHeader}`}        
        };
        
        const authRes = await fetch("http://localhost:5789/auth", options);
        console.log("Result Status: %s | Result redirected from %s", authRes.status, authRes.url);
        
        if(authRes.status === 400 || authRes.status === 401){
            const error = new Error("Credentials are not valid for access to this resource.");
            error.httpStatusCode = authRes.status;        
            throw error;
        }        
        next();        
    }catch(e){
        console.log("There was an error authorizing resources with the authz server.  Error: %s", e);        
        //res.redirect("http://localhost:5789/login");
        res.redirect(config.extServices().auth + "/login");
    }
}

router.use(wrapAsync(useAuthService));

//TODO: ADD token verification to this service and have the .pem file match the auth service's cert.

router.get("/", wrapAsync(async(req, res) => {
    res.send("hello from the protected routes.");
}));

module.exports = router;