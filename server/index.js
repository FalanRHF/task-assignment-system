require("dotenv").config()
const express = require('express')
const app = express()

app.use('/api', require('./api/ApiRouter'))

const SERVER_PORT = process.env.SERVER_PORT || 5050;
app.listen(SERVER_PORT, () => {
  console.log(`SERVER is up and listening to PORT ${SERVER_PORT}`)
})