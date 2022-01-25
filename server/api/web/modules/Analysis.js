const router = require('express').Router()

router.get('/dummy', (req, res) => {
  res.json({
    status: "success",
    name: "dummy"
  })
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


router.get("/data/summarized", async (req, res) => {
  try {
    console.log(`GET url: ${req.originalUrl}`)
    const queryString = `select substring(tc_createdat,1,4) as year, substring(tc_createdat,5,2) as month, sum(case when tc_status='PENDING' then 1 else 0 end) as pending, sum(case when tc_status='IN PROGRESS' then 1 else 0 end) as inprogress, sum(case when tc_status='RESOLVED' then 1 else 0 end) as resolved from ticket group by year,month order by year desc, month desc`
    console.log(queryString)
    const query = await db.query(queryString)
    res.json(query.rows)
    console.log(query.rows)
  } catch (error) {
    console.error(error.message)
  }
})

router.get("/data/all", async (req, res) => {
  try {
    console.log(`GET url: ${req.originalUrl}`)
    const queryString = `select  * from ticket order by tc_createdat desc`
    console.log(queryString)
    const query = await db.query(queryString)
    res.json(query.rows)
    console.log(query.rows)
  } catch (error) {
    console.error(error.message)
  }
})

router.get("/data/:id", async (req, res) => {
  try {
    console.log(`GET url: ${req.originalUrl}`)
    const { id } = req.params
    const queryString = `SELECT * FROM ticket WHERE tc_createdat like '${id}%' order by tc_createdat desc`
    console.log(queryString)
    const query = await db.query(queryString)
    res.json(query.rows)
    console.log(query.rows)
  } catch (error) {
    console.error(error.message)
  }
})

router.get("/newdata/:id", async (req, res) => {
  try {
    console.log(`GET url: ${req.originalUrl}`)
    const { id } = req.params
    const queryString = `select em_fullname as employee, case when tc_monthlyscore is null then 0 else tc_monthlyscore end as score from employee left join (select tc_assignedto,sum(case when tc_priority='MEDIUM' then 4 when tc_priority='HIGH' then 5 else 3 END)+sum(case when (CAST(tc_completeddate as bigint)/1000000) > (CAST(tc_duedate as bigint)/1000000) then -0.5 when CAST(tc_completeddate as bigint)<((CAST(tc_createdat as bigint)+CAST(tc_duedate as bigint))/2) then 0.5 else 0 END) as tc_monthlyscore from ticket where tc_createdat like '${id}%' and tc_status='RESOLVED' group by tc_assignedto) kpitable on em_fullname=tc_assignedto order by score desc, employee asc`
    console.log(queryString)
    const query = await db.query(queryString)
    res.json(query.rows)
    console.log(query.rows)
  } catch (error) {
    console.error(error.message)
  }
})

router.post("/postdata", async (req, res) => {
  try {
    console.log(`POST url: ${req.originalUrl}`)
    const { kp_id, data } = req.body
    var kp_data = JSON.stringify(data)
    let queryString = `INSERT INTO kpi (kp_id,kp_data,kp_emname,kp_emscore) VALUES `
    data.map((item) => queryString += `('${kp_id}','${kp_data}','${item.employee}',${item.score}),`)
    queryString = queryString.slice(0, -1)
    queryString += ` returning *`
    console.log(queryString)
    const query = await db.query(queryString)
    res.json(query.rows)
    console.log(query.rows)
  } catch (error) {
    console.error(error.message)
  }
})

module.exports = router