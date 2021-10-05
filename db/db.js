const Pool = require("pg").Pool;
require('dotenv').config()

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: 'Questions',
  host: process.env.DB_HOST,
  port: 5432
});

module.exports = pool;