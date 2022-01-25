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

router.get("/tickets", async (req, res) => {
  try {
    console.log(`GET url: ${req.originalUrl}`)
    const queryString = `SELECT * FROM ticket`
    console.log(queryString)
    const query = await db.query(queryString);
    res.json(query.rows);
    console.log(query.rows);

  } catch (error) {
    console.error(error.message);
  }
});

router.get("/pendingticket/all", async (req, res) => {
  try {
    console.log(`GET url: ${req.originalUrl}`)
    const queryString = `SELECT * FROM ticket where (tc_status = 'PENDING' OR tc_status = 'IN PROGRESS') ORDER BY tc_createdat DESC`
    console.log(queryString)
    const query = await db.query(queryString)
    res.json(query.rows);
    console.log(query.rows);

  } catch (error) {
    console.error(error.message);
  }
})

router.get("/pendingticket/:cmcode", async (req, res) => {
  try {
    console.log(`GET url: ${req.originalUrl}`)
    const { cmcode } = req.params
    const queryString = `SELECT tc_id,tc_title,tc_status,tc_createdat FROM ticket where tc_cmcode='${cmcode}' AND (tc_status = 'PENDING' OR tc_status = 'IN PROGRESS') ORDER BY tc_createdat DESC`
    console.log(queryString)
    const query = await db.query(queryString);

    res.json(query.rows);
    console.log(query.rows);

  } catch (error) {
    console.error(error.message);
  }
})

router.get("/completedticket/:pjcode", async (req, res) => {
  try {
    console.log(`GET url: ${req.originalUrl}`)
    const { pjcode } = req.params;
    const queryString = `SELECT tc_id,tc_title,tc_createdat,tc_status FROM ticket WHERE tc_id LIKE '${pjcode}%' AND tc_status = 'RESOLVED' ORDER BY tc_completeddate DESC`
    console.log(queryString)
    const query = await db.query(queryString)

    res.json(query.rows)
    console.log(query.rows)

  } catch (error) {
    console.error(error.message)
  }
})

router.get("/resolvedticket/all", async (req, res) => {
  try {
    console.log(`GET url: ${req.originalUrl}`)
    const queryString = `SELECT * FROM ticket where tc_status = 'RESOLVED' ORDER BY tc_completeddate DESC`
    console.log(queryString)
    const query = await db.query(queryString)
    res.json(query.rows)
    console.log(query.rows)

  } catch (error) {
    console.error(error.message)
  }
})

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
})

router.get("/getticketdata/:tcid", async (req, res) => {
  try {
    console.log(`GET url: ${req.originalUrl}`)
    const { tcid } = req.params;
    const queryString = `SELECT * FROM ticket WHERE tc_id = '${tcid}'`
    console.log(queryString)
    const query = await db.query(queryString)
    res.json(query.rows)
    console.log(query.rows)
  } catch (error) {
    console.error(error.message)
  }
});

router.post("/postnewticket", async (req, res) => {
  try {
    console.log(`POST url: ${req.originalUrl}`)
    const { tc_id, tc_cmcode, tc_title, tc_detail, tc_createdat, tc_status } = req.body;
    const queryString = `INSERT INTO ticket(tc_id,tc_cmcode,tc_title,tc_detail,tc_createdat,tc_status) VALUES('${tc_id}','${tc_cmcode}','${tc_title}','${tc_detail}','${tc_createdat}','${tc_status}') RETURNING *`
    console.log(queryString)
    const query = await db.query(queryString)
    res.json(query.rows)
    console.log(query.rows)
  } catch (error) {
    console.error(error.message)
  }
})


router.post("/postnewticketwithimage", async (req, res) => {
  try {
    console.log(`POST url: ${req.originalUrl}`)
    const { tc_id, tc_cmcode, tc_title, tc_detail, tc_createdat, tc_status, tc_filepath } = req.body;
    const queryString = `INSERT INTO ticket(tc_id,tc_cmcode,tc_title,tc_detail,tc_createdat,tc_status,tc_filepath) VALUES('${tc_id}','${tc_cmcode}','${tc_title}','${tc_detail}','${tc_createdat}','${tc_status}','${tc_filepath}') RETURNING *`
    console.log(queryString)
    const query = await db.query(queryString)
    res.json(query.rows);
    console.log(query.rows);
  } catch (error) {
    console.error(error.message);
  }
})

router.post("/uploadfile", async (req, res) => {
  try {
    if (!req.files) {
      res.send({
        status: false,
        message: 'No file uploaded'
      });
    } else {
      let img = req.files.ticketImage;
      console.log(`image.name= ${img.name}`)
      const filePath = 'api/files/attachments/' + img.name

      // literally upload image to filePath
      img.mv(`./public/attachments/${img.name}`)

      res.json({
        status: true,
        message: 'File is uploaded',
        data: {
          name: img.name,
          mimetype: img.mimetype,
          size: img.size,
          path: filePath
        }
      })
    }
  } catch (err) {
    console.error(err)
    res.status(500).send(err)
  }
})

router.post("/updateticketstatus", async (req, res) => {
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

router.post("/deleteticket", async (req, res) => {
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
})

router.post("/updateticketdetails", async (req, res) => {
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
})

module.exports = router