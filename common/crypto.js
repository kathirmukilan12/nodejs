const CryptoJS = require("crypto-js");
require("dotenv").config();

const SECRET = process.env.SECRET_KEY;

exports.encrypt = (data) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET).toString();
};

exports.decrypt = (data) => {
  const bytes = CryptoJS.AES.decrypt(data, SECRET);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};