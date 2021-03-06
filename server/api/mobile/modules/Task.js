const router = require('express').Router()

router.get('/dummy', (req, res) => {
  res.json({
    status: "success",
    restaurant: "dummy"
  });
});

router.get('/dumbo', (req, res) => {
  res.json({
    status: "success",
    restaurant: "dumbo"
  });
});

router.post("/posto", async (req, res) => {
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

router.post("/register/client", (req, res) => {
  generalPost(req, res, 'client')
});

router.post("/register/employee", (req, res) => {
  generalPost(req, res, 'employee')
});

router.post("/register/users", (req, res) => {
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

router.get("/getdata/client/:uid", (req, res) => {
  const { uid } = req.params;
  generalGet(req, res, 'client', 'cl_uid', uid)
});

router.get("/getdata/employee/:uid", (req, res) => {
  const { uid } = req.params;
  generalGet(req, res, 'employee', 'em_uid', uid)
});

router.get("/getdata/user/:uid", (req, res) => {
  const { uid } = req.params;
  generalGet(req, res, 'users', 'us_uid', uid)
});

router.get("/pendingtask", async (req, res) => {
  try {
    console.log(`GET url: ${req.originalUrl}`)
    const queryString = `SELECT * FROM task where ta_status = 'TO DO' OR  ta_status = 'IN PROGRESS' ORDER BY ta_createdat DESC`
    console.log(queryString)
    const query = await db.query(queryString);
    res.json(query.rows);
    console.log(query.rows);
  } catch (error) {
    console.error(error.message);
  }
});

router.get("/completedtask/:ta_assignto", async (req, res) => {
  try {
    console.log(`GET url: ${req.originalUrl}`)
    const { ta_assignto } = req.params
    const queryString = `SELECT * FROM task where ta_status = 'DONE' AND  ta_assignto = '${ta_assignto}' ORDER BY ta_createdat DESC`
    console.log(queryString)
    const query = await db.query(queryString);
    res.json(query.rows);
    console.log(query.rows);
  } catch (error) {
    console.error(error.message);
  }
});

router.get("/gettaskdata/:ta_id", async (req, res) => {
  try {
    console.log(`\nGET url: ${req.originalUrl}`)
    const { ta_id } = req.params
    const queryString = `SELECT * FROM task where ta_id = ${ta_id}`
    console.log(queryString)
    const query = await db.query(queryString);
    res.json(query.rows);
    console.log(query.rows);
  } catch (error) {
    console.error(error.message);
  }
});

router.post("/updatetaskstatus", async (req, res) => {
  try {
    console.log(`POST url: ${req.originalUrl}`)
    const { ta_id, newStatus } = req.body
    const queryString = `UPDATE task SET ta_status = '${newStatus}' WHERE ta_id = '${ta_id}' RETURNING *`
    console.log(queryString)
    const query = await db.query(queryString);
    res.json(query.rows);
    console.log(query.rows);
  } catch (error) {
    console.error(error.message)
  }
})

module.exports = router;