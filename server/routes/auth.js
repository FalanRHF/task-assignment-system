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

routes.post("/register/client", async (req, res) => {
  try {
    console.log(req.body);
    const { cl_uid, cl_username, cl_fullname, cl_email } = req.body;
    const queryString = `INSERT INTO client (cl_uid,cl_username,cl_fullname,cl_email) VALUES('${cl_uid}','${cl_username}','${cl_fullname}','${cl_email}') RETURNING *`
    console.log(queryString)
    const query = await db.query(queryString);
    res.json(query.rows);
    console.log(query.rows);
  } catch (error) {
    console.error(error.message);
  }
});

routes.post("/register/users", async (req, res) => {
  try {
    console.log(req.body);
    const { us_uid, us_type } = req.body;
    const queryString = `INSERT INTO users (us_uid,us_type) VALUES('${us_uid}','${us_type}') RETURNING *`
    console.log(queryString)
    const query = await db.query(queryString);
    res.json(query.rows);
    console.log(query.rows);
  } catch (error) {
    console.error(error.message);
  }
});

routes.get("/getdata/client/:uid", async (req, res) => {
  try {
    console.log(`GET url: ${req.originalUrl}`)
    const { uid } = req.params;
    const queryString = `SELECT * FROM client WHERE cl_uid='${uid}'`
    console.log(queryString)
    const query = await db.query(queryString);
    res.json(query.rows);
    console.log(query.rows);
  } catch (error) {
    console.error(error.message);
  }
});

module.exports = routes;