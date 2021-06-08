require("dotenv").config();
const express = require('express');
const app = express();
const axios = require('axios').default;
const db = require("./db");
const cors = require("cors");

app.use(cors());
app.use(express.json());

app.get("/client", async (req, res) => {
  try {
    const allTodo = await db.query("SELECT * FROM client");
    res.json(allTodo.rows);
  } catch (error) {
    console.error(error.message);
  }
});

app.get("/dummy", async (req, res) => {
  res.json({
    status: "success",
    restaurant: "mcd"
  });
});


app.post("/client", async (req, res) => {
  try {
    console.log(req.body);
    const { uid, username, email, password } = req.body;
    const newTodo = await db.query("INSERT INTO client (cl_uid,cl_username,cl_email,cl_password) VALUES($1, $2, $3, $4) RETURNING *", [uid, username, email, password]);
    res.json(newTodo.rows[0]);
    console.log(res);
  } catch (error) {
    console.error(error.message);
  }
});

app.get("/client/:uid", async (req, res) => {
  try {
    const { uid } = req.params;
    const todo = await db.query("SELECT * FROM client WHERE cl_uid=$1", [uid]);

    res.json(todo.rows[0]);
    console.log(todo.rows[0]);
  } catch (error) {
    console.error(error.message);
  }
});

// axios.get('/users')
//   .then(function (response) {
//     const allTodo = await db.query("SELECT * FROM users");
//     res.json(allTodo.rows);
//     console.log(response);
//   })
//   .catch(function (error) {
//     // handle error
//     console.log(error);
//   });


//const port = process.env.PORT || 3001; //3001 is default val
const port = 5050;
app.listen(port, () => {
  console.log(`server is up and listening to port ${port}`)
});