const pool = require("../config/env.db.config");

exports.loginUser = async (email) => {

  const query = `
    SELECT id, name, email, password
    FROM users
    WHERE email = $1
  `;

  const result = await pool.query(query, [email]);

  return result.rows[0];
};
//const pool = require("../config/env.db.config");

exports.createUser = async (name, email, password) => {

  const query = `
    INSERT INTO users(name,email,password)
    VALUES($1,$2,$3)
    RETURNING id,name,email
  `;

  const result = await pool.query(query, [name, email, password]);

  return result.rows[0];
};
/* FIND USER */
exports.findUserByEmail = async (email) => {

  const query = `
    SELECT id, name, email
    FROM users
    WHERE email = $1
  `;

  const result = await pool.query(query, [email]);

  return result.rows[0];

};
exports.saveOTP = async (email, otp, expiry) => {

  const query = `
    UPDATE users
    SET reset_otp = $1,
        otp_expiry = $2
    WHERE email = $3
  `;

  await pool.query(query, [otp, expiry, email]);

};
exports.getOTP = async (email) => {

  const query = `
    SELECT reset_otp, otp_expiry
    FROM users
    WHERE email = $1
  `;

  const result = await pool.query(query, [email]);

  return result.rows[0];

};
exports.updatePassword = async (email, password) => {

  const query = `
    UPDATE users
    SET password = $1,
        reset_otp = NULL,
        otp_expiry = NULL
    WHERE email = $2
  `;

  await pool.query(query, [password, email]);

};