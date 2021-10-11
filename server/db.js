require("dotenv").config();
const { Pool } = require('pg')
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'smetask',
  password: 'postgres',
  port: process.env.DB_PORT,
})
// module.exports = {
//   query: (text, params) => pool.query(text, params),
// }

module.exports = pool;
