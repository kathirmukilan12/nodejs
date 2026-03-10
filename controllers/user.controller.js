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