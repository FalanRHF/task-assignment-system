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

// routes.get("/pendingticket/:pjcode", async (req, res) => {
//   try {
//     console.log(`GET url: ${req.originalUrl}`)
//     const { pjcode } = req.params;
//     const queryString = `SELECT tc_id,tc_title,tc_status FROM ticket WHERE tc_id LIKE '${pjcode}%' AND (tc_status = 'PENDING' OR tc_status = 'IN PROGRESS') ORDER BY tc_createdat DESC`
//     console.log(queryString)
//     const query = await db.query(queryString);

//     res.json(query.rows);
//     console.log(query.rows);

//   } catch (error) {
//     console.error(error.message);
//   }
// });

// routes.get("/completedticket/:pjcode", async (req, res) => {
//   try {
//     console.log(`GET url: ${req.originalUrl}`)
//     const { pjcode } = req.params;
//     const queryString = `SELECT tc_id,tc_title,tc_status FROM ticket WHERE tc_id LIKE '${pjcode}%' AND tc_status = 'RESOLVED' ORDER BY tc_createdat DESC`
//     console.log(queryString)
//     const query = await db.query(queryString);

//     res.json(query.rows);
//     console.log(query.rows);

//   } catch (error) {
//     console.error(error.message);
//   }
// });

// routes.get("/lastid/:tcid", async (req, res) => {
//   try {
//     console.log(`GET url: ${req.originalUrl}`)
//     const { tcid } = req.params;
//     const queryString = `SELECT * FROM ticket WHERE tc_id LIKE '${tcid}%' ORDER BY tc_id DESC FETCH FIRST ROW ONLY`
//     console.log(queryString)
//     const query = await db.query(queryString)
//     res.json(query.rows);
//     console.log(query.rows);
//   } catch (error) {
//     console.error(error.message);
//   }
// });

routes.get("/getticketdata/:taid", async (req, res) => {
  try {
    console.log(`GET url: ${req.originalUrl}`)
    const { taid } = req.params;
    const queryString = `SELECT * FROM ticket WHERE ta_id = '${taid}'`
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
    const { ta_id, ta_title, ta_description, ta_assignto, ta_createdat, ta_status, ta_duedate, ta_fileurl } = req.body;
    const queryString = `INSERT INTO task(ta_id,ta_title,ta_description,ta_assignto,ta_createdat,ta_status,ta_duedate,ta_fileurl) VALUES('${ta_id}','${ta_title}','${ta_description}',''${ta_assignto}',${ta_createdat}','${ta_status}','${ta_duedate}','${ta_fileurl}',) RETURNING *`
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
    const { ta_id, newStatus } = req.body;
    const queryString = `UPDATE ticket SET ta_status = '${newStatus}' WHERE ta_id = '${ta_id}' RETURNING *`
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
    const { ta_id } = req.body;
    const queryString = `DELETE FROM ticket WHERE ta_id = '${ta_id}' RETURNING *`
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
    const { ta_id, ta_title, ta_description } = req.body;
    const queryString = `UPDATE ticket SET ta_title = '${ta_title}',ta_description = '${ta_description}'  WHERE ta_id = '${ta_id}' RETURNING *`
    console.log(queryString)
    const query = await db.query(queryString)
    res.json(query.rows);
    console.log(query.rows);
  } catch (error) {
    console.error(error.message);
  }
});

module.exports = routes;