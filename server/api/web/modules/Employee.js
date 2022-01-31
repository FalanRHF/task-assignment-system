const router = require('express').Router()


router.get("/getemployee", async (req, res) => {
  try {
    console.log(`GET url: ${req.originalUrl}`)
    const queryString = `SELECT * FROM employee`
    console.log(queryString)
    const query = await db.query(queryString);
    res.json(query.rows);
    console.log(query.rows);

  } catch (error) {
    console.error(error.message);
  }
});

router.post("/postnewemployee", async (req, res) => {
  try {
    console.log(`POST url: ${req.originalUrl}`)
    const { em_email } = req.body;
    const queryString = `INSERT INTO employee(em_email) VALUES('${em_email}') RETURNING *`
    console.log(queryString)
    const query = await db.query(queryString)
    res.json(query.rows);
    console.log(query.rows);
  } catch (error) {
    console.error(error.message);
  }
});

router.delete("/deleteemployee/:em_email", async (req, res) => {
  try {
    console.log(`POST url: ${req.originalUrl}`)
    const { em_email } = req.params;
    const queryString = `DELETE FROM employee WHERE em_email = '${em_email}' RETURNING *`
    console.log(queryString)
    const query = await db.query(queryString)
    res.json(query.rows);
    console.log(query.rows);
  } catch (error) {
    console.error(error.message);
  }
});

module.exports = router