require("dotenv").config();
// const express = require('express');
// const app = express();
// const axios = require('axios').default;
// const db = require("./db")
// const cors = require("cors");
// const bodyParser = require('body-parser');
// const morgan = require('morgan');
// const _ = require('lodash');

const db = require("./db")
const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const _ = require('lodash');


const AuthRoutes = require('./routes/auth')
const HelpdeskRoutes = require('./routes/helpdesk')
const ClientProfileRoutes = require('./routes/clientProfile')
const TaskRoutes = require('./routes/task')

const app = express();

// enable files upload
app.use(fileUpload({
  createParentPath: true
}));

//add other middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));


// app.use(cors());
// app.use(express.json());
app.use('/auth', AuthRoutes)
app.use('/helpdesk', HelpdeskRoutes)
app.use('/clientprofile', ClientProfileRoutes)
app.use('/task', TaskRoutes)


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