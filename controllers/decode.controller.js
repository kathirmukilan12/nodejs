const { encrypt } = require("../common/crypto");

exports.encryptPayload = async (req, res) => {

  try {

    const encrypted = encrypt(req.body);

    return res.json({
      status: "success",
      encryptedData: encrypted
    });

  } catch (error) {

    return res.status(500).json({
      status: "error",
      message: error.message
    });

  }

};
