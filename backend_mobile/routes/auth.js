const routes = require('express').Router();
const db = require("../db")

routes.get('/dummy', (req, res) => {
  res.json({
    status: "success",
    restaurant: "dummy"
  });
});

routes.get('/dumbo', (req, res) => {
  res.json({
    status: "success",
    restaurant: "dumbo"
  });
});

routes.post("/posto", async (req, res) => {
  console.log('posto called')
  posto(req, res, 'meow')
})

const generalPost = async (req, res, tablename) => {
  try {
    console.log(`POST url: ${req.originalUrl}`)
    const data = req.body
    const columnNames = JSON.stringify(Object.keys(data)).replace(/['"\[\]]+/g, '')
    const columnValues = JSON.stringify(Object.values(data)).replace(/[\[\]]+/g, '').replace(/["]+/g, '\'')
    const queryString = `INSERT INTO ${tablename} (${columnNames}) VALUES(${columnValues}) RETURNING *`
    console.log(queryString)
    const query = await db.query(queryString);
    res.json(query.rows);
    console.log(query.rows);
  } catch (error) {
    console.error(error.message);
  }
}

routes.post("/register/client", async (req, res) => {
  generalPost(req, res, 'client')
});

routes.post("/register/employee", (req, res) => {
  generalPost(req, res, 'employee')
});

routes.post("/register/users", (req, res) => {
  generalPost(req, res, 'users')
});

const generalGet = async (req, res, table, columnName, columnData) => {
  try {
    console.log(`GET url: ${req.originalUrl}`)
    const queryString = `SELECT * FROM ${table} WHERE ${columnName}='${columnData}'`
    console.log(queryString)
    const query = await db.query(queryString);
    res.json(query.rows);
    console.log(query.rows);
  } catch (error) {
    console.error(error.message);
  }
}

routes.get("/getdata/client/:uid", (req, res) => {
  const { uid } = req.params;
  generalGet(req, res, 'client', 'cl_uid', uid)
});

routes.get("/getdata/employee/:uid", (req, res) => {
  const { uid } = req.params;
  generalGet(req, res, 'employee', 'em_uid', uid)
});

routes.get("/getdata/user/:uid", (req, res) => {
  const { uid } = req.params;
  generalGet(req, res, 'users', 'us_uid', uid)
});

module.exports = routes;