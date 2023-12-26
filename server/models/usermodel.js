const db = require('../models/db');

exports.getUserByEmails = async (email) => {
    const userQuery = "SELECT * FROM users WHERE email = $1";
    const user = await db.query(userQuery, [email]);
    return user.rows[0];
  };

exports.createUsers = async ({ username, email }) => {
    const created_at = new Date();
    const password = "No Access";
    const userrole = "1";
    const query = `
    INSERT INTO users (username,email,password,userrole,created_at) VALUES ($1, $2, $3, $4, $5)
    RETURNING *`;

    const values = [
      username,
      email,
      password,
      userrole,
      created_at,
    ];
    const user = await db.query(query, values);
    return user.rows[0];
  };
