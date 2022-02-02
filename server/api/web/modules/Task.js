const router = require('express').Router()

router.get("/getticket", async (req, res) => {
  try {
    console.log(`GET url: ${req.originalUrl}`)
    const queryString = `SELECT * FROM ticket ORDER BY tc_createdat desc`
    console.log(queryString)
    const query = await db.query(queryString);
    res.json(query.rows);
    console.log(query.rows);

  } catch (error) {
    console.error(error.message);
  }
});

router.post("/postnewticket", async (req, res) => {
  try {
    console.log(`POST url: ${req.originalUrl}`)
    const { tc_id, tc_title, tc_detail, tc_assignedto, tc_createdat, tc_status, tc_duedate, tc_priority } = req.body;
    const queryString = `INSERT INTO ticket(tc_id,tc_cmcode,tc_title,tc_detail,tc_assignedto,tc_createdat,tc_status,tc_duedate,tc_priority) VALUES('${tc_id}','NETSYS','${tc_title}','${tc_detail}','${tc_assignedto}','${tc_createdat}','${tc_status}','${tc_duedate}','${tc_priority}') RETURNING *`
    console.log(queryString)
    const query = await db.query(queryString)
    res.json(query.rows);
    console.log(query.rows);
  } catch (error) {
    console.error(error.message);
  }
});

router.post("/postnewticketwithfile", async (req, res) => {
  try {
    console.log(`POST url: ${req.originalUrl}`)
    const { tc_id, tc_title, tc_detail, tc_assignedto, tc_createdat, tc_status, tc_duedate, tc_priority, tc_filepath } = req.body;
    const queryString = `INSERT INTO ticket(tc_id,tc_cmcode,tc_title,tc_detail,tc_assignedto,tc_createdat,tc_status,tc_duedate,tc_priority,tc_filepath) VALUES('${tc_id}','NETSYS','${tc_title}','${tc_detail}','${tc_assignedto}','${tc_createdat}','${tc_status}','${tc_duedate}','${tc_priority}','${tc_filepath}') RETURNING *`
    console.log(queryString)
    const query = await db.query(queryString)
    res.json(query.rows);
    console.log(query.rows);
  } catch (error) {
    console.error(error.message);
  }
});

router.get("/lastid/:tcid", async (req, res) => {
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

router.post('/uploadfile/:tcid', (req, res) => {
  if (req.files === null) {
    return res.status(400).json({ msg: 'No file uploaded' });
  }

  const { tcid } = req.params;
  const filename = tcid + '.jpg'
  const file = req.files.file;

  file.mv(`./public/attachments/${filename}`, err => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }

    res.json({ fileName: filename, filePath: `/uploads/${filename}` });
  });
});

router.delete("/deleteticket/:tc_id", async (req, res) => {
  try {
    console.log(`POST url: ${req.originalUrl}`)
    const { tc_id } = req.params;
    const queryString = `DELETE FROM ticket WHERE tc_id = '${tc_id}' RETURNING *`
    console.log(queryString)
    const query = await db.query(queryString)
    res.json(query.rows);
    console.log(query.rows);
  } catch (error) {
    console.error(error.message);
  }
});

router.post("/updatetask", async (req, res) => {
  try {
    console.log(`POST url: ${req.originalUrl}`)
    const { tc_id, tc_title, tc_detail, tc_assignedto, tc_duedate, tc_priority} = req.body;
    const queryString = `UPDATE ticket SET tc_title = '${tc_title}', tc_detail = '${tc_detail}', tc_assignedto = '${tc_assignedto}', tc_duedate = '${tc_duedate}', tc_priority = '${tc_priority}'  WHERE tc_id = '${tc_id}' RETURNING *`
    console.log(queryString)
    const query = await db.query(queryString)
    res.json(query.rows);
    console.log(query.rows);
  } catch (error) {
    console.error(error.message);
  }
});

router.get("/getemployee", async (req, res) => {
  try {
    console.log(`GET url: ${req.originalUrl}`)
    const queryString = `SELECT em_fullname FROM employee`
    console.log(queryString)
    const query = await db.query(queryString);
    res.json(query.rows);
    console.log(query.rows);

  } catch (error) {
    console.error(error.message);
  }
});

router.get("/getworkload/", async (req, res) => {
  try {
    console.log(`GET url: ${req.originalUrl}`)
    const queryString = `select employee, workload, case when score is null then 0 else score end as score, workload+(case when score is null then 0 else score end) as totalworkload from (
      select em_fullname as employee, case when tc_low is null then 0 else tc_low end as low, case when tc_medium is null then 0 else tc_medium end as medium, case when tc_high is null then 0 else tc_high end as high, case when (tc_low*3+tc_medium*4+tc_high*5) is null then 0 else (tc_low*3+tc_medium*4+tc_high*5) end as workload, score from employee left join (select tc_assignedto, sum(case when tc_priority='LOW' then 1 else 0 end) as tc_low, sum(case when tc_priority='MEDIUM' then 1 else 0 end) as tc_medium, sum(case when tc_priority='HIGH' then 1 else 0 end)as tc_high from ticket where  tc_status='PENDING' or tc_status='IN PROGRESS' group by tc_assignedto) workloadtable on em_fullname=tc_assignedto left join (select kp_emname, sum(kp_score) as score from kpi group by kp_emname) kpitable on em_fullname = kp_emname order by workload desc, employee asc
    ) as finaltable order by totalworkload asc`
    console.log(queryString)
    const query = await db.query(queryString);
    res.json(query.rows);
    console.log(query.rows);

  } catch (error) {
    console.error(error.message);
  }
});

module.exports = router