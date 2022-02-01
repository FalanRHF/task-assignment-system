const router = require('express').Router()


router.get("/getcompany", async (req, res) => {
  try {
    console.log(`GET url: ${req.originalUrl}`)
    const queryString = `SELECT client.cl_fullname, client.cl_phonenum, company.cm_name, company.cm_code, company.cm_detail FROM client RIGHT JOIN company ON client.cl_cmcode = company.cm_code`
    console.log(queryString)
    const query = await db.query(queryString);
    res.json(query.rows);
    console.log(query.rows);

  } catch (error) {
    console.error(error.message);
  }
});

router.post("/postnewcompany", async (req, res) => {
  try {
    console.log(`POST url: ${req.originalUrl}`)
    const { cm_name, cm_code, cm_detail } = req.body;
    const queryString = `INSERT INTO company(cm_name,cm_code,cm_detail) VALUES('${cm_name}','${cm_code}','${cm_detail}') RETURNING *`
    console.log(queryString)
    const query = await db.query(queryString)
    res.json(query.rows);
    console.log(query.rows);
  } catch (error) {
    console.error(error.message);
  }
});

router.delete("/deletecompany/:cm_code", async (req, res) => {
  try {
    console.log(`POST url: ${req.originalUrl}`)
    const { cm_code } = req.params;
    const queryString = `DELETE FROM company WHERE cm_code = '${cm_code}' RETURNING *`
    console.log(queryString)
    const query = await db.query(queryString)
    res.json(query.rows);
    console.log(query.rows);
  } catch (error) {
    console.error(error.message);
  }
});

router.post("/updatecompany", async (req, res) => {
  try {
    console.log(`POST url: ${req.originalUrl}`)
    const { cm_name, cm_code, cm_detail} = req.body;
    const queryString = `UPDATE company SET cm_name = '${cm_name}',cm_detail = '${cm_detail}'  WHERE cm_code = '${cm_code}' RETURNING *`
    console.log(queryString)
    const query = await db.query(queryString)
    res.json(query.rows);
    console.log(query.rows);
  } catch (error) {
    console.error(error.message);
  }
});

module.exports = router