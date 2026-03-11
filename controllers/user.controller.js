const bcrypt = require("bcrypt");
const userService = require("../services/user.service");

exports.register = async (req, res) => {
  try {

    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userService.createUser(
      name,
      email,
      hashedPassword
    );

    res.json({
      message: "User created successfully",
      user
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};

exports.login = async (req, res) => {
  try {

    const { email, password } = req.body;

    const user = await userService.loginUser(email);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({
        message: "Invalid password"
      });
    }

    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};
const crypto = require("crypto");
//const userService = require("../services/user.service");
const sendEmail = require("../common/email");

exports.forgotPassword = async (req, res) => {

  const { email } = req.body;

  const user = await userService.findUserByEmail(email);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000);

  const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min

  await userService.saveOTP(email, otp, expiry);

  await sendEmail(email, "Password Reset OTP", `Your OTP is ${otp}`);

  res.json({ message: "OTP sent to email" });

};
exports.verifyOTP = async (req, res) => {

  const { email, otp } = req.body;

  const user = await userService.getOTP(email);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.reset_otp !== otp) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  if (new Date() > user.otp_expiry) {
    return res.status(400).json({ message: "OTP expired" });
  }

  res.json({ message: "OTP verified" });

};
exports.resetPassword = async (req, res) => {

  try {

    const { email, otp, password } = req.body;

    const user = await userService.getOTP(email);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    /* OTP validation */

    if (user.reset_otp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP"
      });
    }

    if (new Date() > user.otp_expiry) {
      return res.status(400).json({
        message: "OTP expired"
      });
    }

    /* hash new password */

    const hashedPassword = await bcrypt.hash(password, 10);

    await userService.updatePassword(email, hashedPassword);

    res.json({
      message: "Password updated successfully"
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};