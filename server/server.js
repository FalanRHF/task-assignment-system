require("dotenv").config();
const express = require('express');
const app = express();
const axios = require('axios').default;
const db = require("./db")
const cors = require("cors");
const AuthRoutes = require('./routes/auth')
const HelpdeskRoutes = require('./routes/helpdesk')
const ClientProfileRoutes = require('./routes/clientProfile')

app.use(cors());
app.use(express.json());
app.use('/auth', AuthRoutes)
app.use('/helpdesk', HelpdeskRoutes)
app.use('/clientprofile', ClientProfileRoutes)


app.get("/dummy", async (req, res) => {
  res.json({
    status: "success",
    restaurant: "mcd"
  });
});

//const port = process.env.PORT || 3001; //3001 is default val
const port = 5050;
app.listen(port, () => {
  console.log(`server is up and listening to port ${port}`)
});