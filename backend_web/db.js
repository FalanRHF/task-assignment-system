require("dotenv").config();
const { Pool } = require('pg')
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'smetask',
  password: '1234',
  port: process.env.DB_PORT,
})
// module.exports = {
//   query: (text, params) => pool.query(text, params),
// }

module.exports = pool;

// const Pool = require("pg").Pool;

// const pool = new Pool({
//     user: "postgres",
//     password: "1234",
//     host: "localhost",
//     port: 5432,
//     database: "smetask"
// });

// module.exports = pool;