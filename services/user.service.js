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