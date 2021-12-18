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

routes.get("/pendingticket/:pjcode", async (req, res) => {
  try {
    console.log(`GET url: ${req.originalUrl}`)
    const { pjcode } = req.params;
    const queryString = `SELECT tc_id,tc_title,tc_status,tc_createdat FROM ticket WHERE tc_pjcode = '${pjcode}' AND (tc_status = 'PENDING' OR tc_status = 'IN PROGRESS') ORDER BY tc_createdat DESC`
    console.log(queryString)
    const query = await db.query(queryString);

    res.json(query.rows);
    console.log(query.rows);

  } catch (error) {
    console.error(error.message);
  }
});

routes.get("/completedticket/:pjcode", async (req, res) => {
  try {
    console.log(`GET url: ${req.originalUrl}`)
    const { pjcode } = req.params;
    const queryString = `SELECT tc_id,tc_title,tc_createdat,tc_status FROM ticket WHERE tc_id LIKE '${pjcode}%' AND tc_status = 'RESOLVED' ORDER BY tc_createdat DESC`
    console.log(queryString)
    const query = await db.query(queryString);

    res.json(query.rows);
    console.log(query.rows);

  } catch (error) {
    console.error(error.message);
  }
});

routes.get("/lastid/:tcid", async (req, res) => {
  try {
    console.log(`GET url: ${req.originalUrl}`)
    const { tcid } = req.params;
    const queryString = `SELECT * FROM ticket WHERE tc_id LIKE '${tcid}%' ORDER BY tc_id DESC FETCH FIRST ROW ONLY`
    console.log(queryString)
    const query = await db.query(queryString)
    res.json(query.rows);
    console.log(query.rows);
  } catch (error) {
    console.error(error.message);
  }
});

routes.get("/getticketdata/:tcid", async (req, res) => {
  try {
    console.log(`GET url: ${req.originalUrl}`)
    const { tcid } = req.params;
    const queryString = `SELECT * FROM ticket WHERE tc_id = '${tcid}'`
    console.log(queryString)
    const query = await db.query(queryString)
    res.json(query.rows);
    console.log(query.rows);
  } catch (error) {
    console.error(error.message);
  }
});

routes.post("/postnewticket", async (req, res) => {
  try {
    console.log(`POST url: ${req.originalUrl}`)
    const { tc_id, tc_pjcode, tc_title, tc_detail, tc_createdat, tc_status } = req.body;
    const queryString = `INSERT INTO ticket(tc_id,tc_pjcode,tc_title,tc_detail,tc_createdat,tc_status) VALUES('${tc_id}','${tc_pjcode}','${tc_title}','${tc_detail}','${tc_createdat}','${tc_status}') RETURNING *`
    console.log(queryString)
    const query = await db.query(queryString)
    res.json(query.rows);
    console.log(query.rows);
  } catch (error) {
    console.error(error.message);
  }
});

routes.post("/updateticketstatus", async (req, res) => {
  try {
    console.log(`POST url: ${req.originalUrl}`)
    const { tc_id, newStatus } = req.body;
    const queryString = `UPDATE ticket SET tc_status = '${newStatus}' WHERE tc_id = '${tc_id}' RETURNING *`
    console.log(queryString)
    const query = await db.query(queryString)
    res.json(query.rows);
    console.log(query.rows);
  } catch (error) {
    console.error(error.message);
  }
});

routes.post("/deleteticket", async (req, res) => {
  try {
    console.log(`POST url: ${req.originalUrl}`)
    const { tc_id } = req.body;
    const queryString = `DELETE FROM ticket WHERE tc_id = '${tc_id}' RETURNING *`
    console.log(queryString)
    const query = await db.query(queryString)
    res.json(query.rows);
    console.log(query.rows);
  } catch (error) {
    console.error(error.message);
  }
});

routes.post("/updateticketdetails", async (req, res) => {
  try {
    console.log(`POST url: ${req.originalUrl}`)
    const { tc_id, tc_title, tc_detail } = req.body;
    const queryString = `UPDATE ticket SET tc_title = '${tc_title}',tc_detail = '${tc_detail}'  WHERE tc_id = '${tc_id}' RETURNING *`
    console.log(queryString)
    const query = await db.query(queryString)
    res.json(query.rows);
    console.log(query.rows);
  } catch (error) {
    console.error(error.message);
  }
});

module.exports = routes;