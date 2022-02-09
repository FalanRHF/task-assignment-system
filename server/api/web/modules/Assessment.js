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


router.get("/data/all", async (req, res) => {
  try {
    console.log(`GET url: ${req.originalUrl}`)
    const queryString = `SELECT * FROM kpi ORDER BY kp_id DESC, kp_score desc, kp_emname asc`
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
    const queryString = `SELECT * FROM kpi WHERE kp_id = '${id}'`
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
    const queryString =
      `select
    em_fullname as employee,
    case when tc_low is null then 0 else tc_low end as low,
    case when tc_medium is null then 0 else tc_medium end as medium,
    case when tc_high is null then 0 else tc_high end as high,
    case when tc_early is null then 0 else tc_early end as early,
    case when tc_notearly is null then 0 else tc_notearly end as notearly,
    case when tc_overdue is null then 0 else tc_overdue end as overdue,
    case when (tc_low*3+tc_medium*4+tc_high*5+tc_early*0.5-tc_overdue*0.5) is null then 0
    else (tc_low*3+tc_medium*4+tc_high*5+tc_early*0.5-tc_overdue*0.5) end as score
    from employee
    left join (
      select tc_assignedto, 
      sum(case when tc_priority='LOW' then 1 else 0 end) as tc_low, 
      sum(case when tc_priority='MEDIUM' then 1 else 0 end) as tc_medium, 
      sum(case when tc_priority='HIGH' then 1 else 0 end) as tc_high, 
      sum(case when CAST(tc_completeddate as bigint)<((CAST(tc_createdat as bigint)+CAST(tc_duedate as bigint))/2) then 1 else 0 END) as tc_early, 
      sum(case when CAST(tc_completeddate as bigint)>=((CAST(tc_createdat as bigint)+CAST(tc_duedate as bigint))/2) then 1 else 0 END) as tc_notearly, 
      sum(case when (CAST(tc_completeddate as bigint)/1000000)>(CAST(tc_duedate as bigint)/1000000) then 1 ELSE 0 END) as tc_overdue 
      from ticket 
      where tc_completeddate like '${id}%' 
      and tc_status='RESOLVED' 
      group by tc_assignedto
    ) kpitable 
    on em_fullname=tc_assignedto 
    order by score desc, employee asc`
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
    const { id, data } = req.body
    var kp_data = JSON.stringify(data)
    let queryString = `INSERT INTO kpi (kp_id,kp_emname,kp_low,kp_medium,kp_high,kp_early,kp_notearly,kp_overdue,kp_score) VALUES `
    data.map((item) => queryString += `('${id}','${item.employee}',${item.low},${item.medium},${item.high},${item.early},${item.notearly},${item.overdue},${item.score}),`)
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