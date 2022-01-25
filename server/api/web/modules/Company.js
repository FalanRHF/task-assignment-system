const router = require('express').Router()


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

router.get("/pendingticket/:pjcode", async (req, res) => {
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

// router.get("/", async (req, res) => {
//   try {
//     console.log(`GET url: ${req.originalUrl}`)
//     const { pjcode } = req.params;
//     const queryString = `SELECT tc_id,tc_title,tc_createdat,tc_status FROM ticket WHERE tc_id LIKE '${pjcode}%' AND tc_status = 'RESOLVED' ORDER BY tc_createdat DESC`
//     console.log(queryString)
//     const query = await db.query(queryString);

//     res.json(query.rows);
//     console.log(query.rows);

//   } catch (error) {
//     console.error(error.message);
//   }
// });

router.get("/completedticket/:pjcode", async (req, res) => {
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

router.get("/lastid/:taid", async (req, res) => {
  try {
    console.log(`GET url: ${req.originalUrl}`)
    const { taid } = req.params;
    const queryString = `SELECT * FROM task WHERE ta_id LIKE '${taid}%' ORDER BY ta_id DESC FETCH FIRST ROW ONLY`
    console.log(queryString)
    const query = await db.query(queryString)
    res.json(query.rows);
    console.log(query.rows);
  } catch (error) {
    console.error(error.message);
  }
});

router.get("/getticketdata/:tcid", async (req, res) => {
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

router.post("/postnewtask", async (req, res) => {
  try {
    console.log(`POST url: ${req.originalUrl}`)
    const { ta_id, ta_title, ta_detail, ta_createdat, ta_status, ta_duedate } = req.body;
    const queryString = `INSERT INTO task(ta_id,ta_pjcode,ta_title,ta_detail,ta_createdat,ta_status,ta_duedate) VALUES('${ta_id}','NETSYS','${ta_title}','${ta_detail}','${ta_createdat}','${ta_status}','${ta_duedate}') RETURNING *`
    console.log(queryString)
    const query = await db.query(queryString)
    res.json(query.rows);
    console.log(query.rows);
  } catch (error) {
    console.error(error.message);
  }
});


router.post("/postnewtaskwithfile", async (req, res) => {
  try {
    console.log(`POST url: ${req.originalUrl}`)
    const { ta_id, ta_pjcode, ta_title, ta_detail, ta_createdat, ta_status, ta_duedate, ta_filepath } = req.body;
    const queryString = `INSERT INTO task(ta_id,ta_title,ta_detail,ta_createdat,ta_status,ta_duedate,ta_filepath) VALUES('${ta_id}','${ta_pjcode}','${ta_title}','${ta_detail}','${ta_createdat}','${ta_status}','${ta_duedate}','${ta_filepath}') RETURNING *`
    console.log(queryString)
    const query = await db.query(queryString)
    res.json(query.rows);
    console.log(query.rows);
  } catch (error) {
    console.error(error.message);
  }
});

//ask falan
router.post("/uploadfile", async (req, res) => {
  try {
    if (!req.files) {
      res.send({
        status: false,
        message: 'No file uploaded'
      });
    } else {
      let file = req.files.taskFile;
      console.log(`file.name= ${file.name}`)
      const filePath = 'attachments/' + file.name
      // literally upload image to filePath
      img.mv(`./public/${filePath}`)

      res.send({
        status: true,
        message: 'File is uploaded',
        data: {
          name: file.name,
          mimetype: img.mimetype,
          size: file.size,
          path: filePath
        }
      })
    }
  } catch (err) {
    console.error(err)
    res.status(500).send(err);
  }
});

router.post("/getfile", async (req, res) => {
  try {
    console.info(`POST url: ${req.originalUrl}`)
    const { filePath } = req.body
    console.log(`filePath=${filePath}`)
    // var data = getIcon(req.params.w);
    // var img = Buffer.from(data, 'base64');


    // const img = await fs.readFile(`./${filePath}`, { encoding: 'base64' });
    // console.log(img)

    // res.writeHead(200, {
    //   'Content-Type': 'image/jpg',
    //   'Content-Length': img.length
    // });
    // res.end(img);
    //   res.contentType('jpg')
    res.sendFile(path.join(__dirname, `../${filePath}`))

    // var options = {
    //   root: path.join(__dirname)
    // }

    // var fileName = `../${filePath}`;
    // res.contentType('jpg')
    // res.sendFile(fileName, options, (err) => {
    //   if (err) {
    //     console.log(err)
    //   } else {
    //     console.log('Sent:', fileName)
    //   }
    // })
  } catch (err) {
    console.log(err)
    res.status(500).send(err);
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
});

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
});

module.exports = router