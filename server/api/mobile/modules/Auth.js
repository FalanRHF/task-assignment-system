const router = require('express').Router();

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
    const query = await db.query(queryString)
    res.json(query.rows)
    console.log(query.rows)
  } catch (error) {
    console.error(error.message)
  }
}

router.post("/register/client", async (req, res) => {
  generalPost(req, res, 'client')
})

router.post("/register/employee", async (req, res) => {
  try {
    console.log(`POST url: ${req.originalUrl}`)
    const { em_uid, em_fullname, em_email, em_phonenum } = req.body
    const queryString = `UPDATE employee set em_uid='${em_uid}', em_fullname='${em_fullname}', em_phonenum='${em_phonenum}' where em_email='${em_email}' returning *`
    console.log(queryString)
    const query = await db.query(queryString)
    res.json(query.rows)
    console.log(query.rows)
  } catch (error) {
    console.error(error.message)
  }
})

router.post("/register/users", (req, res) => {
  generalPost(req, res, 'users')
})

const generalGet = async (req, res, table, columnName, columnData) => {
  try {
    console.log(`GET url: ${req.originalUrl}`)
    const queryString = `SELECT * FROM ${table} WHERE ${columnName}='${columnData}'`
    console.log(queryString)
    const query = await db.query(queryString)
    res.json(query.rows)
    console.log(query.rows)
  } catch (error) {
    console.error(error.message)
  }
}

router.get("/getdata/client/:uid", async (req, res) => {
  try {
    console.log(`GET url: ${req.originalUrl}`)
    const { uid } = req.params
    const queryString = `select a.*, b.cm_name from client a join company b on a.cl_cmcode = b.cm_code where cl_uid='${uid}'`
    console.log(queryString)
    const query = await db.query(queryString)
    res.json(query.rows)
    console.log(query.rows)
  } catch (error) {
    console.error(error.message)
  }
})

router.get("/getdata/employee/:uid", (req, res) => {
  const { uid } = req.params;
  generalGet(req, res, 'employee', 'em_uid', uid)
})

router.get("/getdata/user/:uid", (req, res) => {
  const { uid } = req.params;
  generalGet(req, res, 'users', 'us_uid', uid)
})

router.get("/company/:code", (req, res) => {
  const { code } = req.params;
  generalGet(req, res, 'company', 'cm_code', code)
})

router.get("/employee/email/:email", (req, res) => {
  const { email } = req.params;
  generalGet(req, res, 'employee', 'em_email', email)
})

module.exports = router