const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const commonController = require("../controllers/decode.controller");

router.post("/encrypt", commonController.encryptPayload);
//router.post("/register", userController.register);
module.exports = router;