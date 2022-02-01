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

router.post("/client/update", async (req, res) => {
  try {
    console.log(`POST url: ${req.originalUrl}`)
    const { cl_uid, cl_fullname, cl_phonenum } = req.body
    console.log(req.body)
    const queryString = `UPDATE client SET cl_fullname='${cl_fullname}', cl_phonenum='${cl_phonenum}' WHERE cl_uid='${cl_uid}' RETURNING *`
    console.log(queryString)
    const query = await db.query(queryString)
    res.json(query.rows);
    console.log(query.rows);
  } catch (error) {
    console.error(error.message);
  }
});

router.post("/employee/update", async (req, res) => {
  try {
    console.log(`POST url: ${req.originalUrl}`)
    const { em_uid, em_fullname, em_phonenum } = req.body
    console.log(req.body)
    const queryString = `UPDATE employee SET em_fullname='${em_fullname}', em_phonenum='${em_phonenum}' WHERE em_uid='${em_uid}' RETURNING *`
    console.log(queryString)
    const query = await db.query(queryString)
    res.json(query.rows);
    console.log(query.rows);
  } catch (error) {
    console.error(error.message);
  }
})

module.exports = router


// router.post("/updateproject", async (req, res) => {
//   try {
//     console.log(`POST url: ${req.originalUrl}`)
//     const { cl_uid, cl_pjcode } = req.body
//     const queryString = `UPDATE client SET cl_pjcode='{${cl_pjcode}}' WHERE cl_uid='${cl_uid}' RETURNING *`
//     console.log(queryString)
//     const query = await db.query(queryString)
//     res.json(query.rows);
//     console.log(query.rows);
//   } catch (error) {
//     console.error(error.message);
//   }
// });

// router.post("/changeproject", async (req, res) => {
//   try {
//     console.log(`POST url: ${req.originalUrl}`)
//     const { cl_uid, cl_curpj } = req.body
//     const queryString = `UPDATE client SET cl_curpj='${cl_curpj}' WHERE cl_uid='${cl_uid}' RETURNING *`
//     console.log(queryString)
//     const query = await db.query(queryString)
//     res.json(query.rows);
//     console.log(query.rows);
//   } catch (error) {
//     console.error(error.message);
//   }
// });
