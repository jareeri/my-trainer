const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  password: '246761',
  host: 'localhost',
  port: 5432, // default Postgres port
  database: 'my tainer'
});
module.exports = {
    query: (text, params) => pool.query(text, params)
  };