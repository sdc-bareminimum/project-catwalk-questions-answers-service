const Pool = require("pg").Pool;
require('dotenv').config()

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE,
  host: process.env.DB_HOST,
  port: '5432'
});

console.log(process.env.DB_USER);

module.exports = pool;
