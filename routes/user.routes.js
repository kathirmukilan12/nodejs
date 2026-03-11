const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller");
const { decrypt } = require("../common/crypto");

router.post("/login", (req, res, next) => {

  try {

    const encryptedData = req.body.data;

    const decrypted = decrypt(encryptedData);

    req.body = decrypted;

    next();

  } catch (error) {

    return res.status(400).json({
      message: "Invalid encrypted payload"
    });

  }

}, userController.login);
router.post("/register", userController.register);

/* FORGOT PASSWORD - send OTP */
router.post("/forgot-password", userController.forgotPassword);

/* VERIFY OTP */
router.post("/verify-otp", userController.verifyOTP);

/* RESET PASSWORD */
router.post("/reset-password", userController.resetPassword);
module.exports = router;