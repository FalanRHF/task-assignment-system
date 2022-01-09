const { Pool } = require('pg')


// Pool auto configured with values from .env
const pool = new Pool()

// --- MANUAL CONFIG ---
// const pool = new Pool({
//   user: 'postgres',
//   host: 'localhost',
//   database: 'smetask',
//   password: '1234',
//   port: 5432,
// })

module.exports = {
  query: (text, params) => pool.query(text, params),
}

// module.exports = pool