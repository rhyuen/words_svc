const express = require("express");
const unauthed = require("../controllers/unauthedController.js");

const router = express.Router();

router.get("/", unauthed.index);

module.exports = router;