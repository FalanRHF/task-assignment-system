const router = require('express').Router()

router.get("/getticket", async (req, res) => {
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

// router.post("/uploadfile", async (req, res) => {
//   try {
//     if (!req.files) {
//       console.log(`GET url: ${req.originalUrl}`)
//       res.send({
//         status: false,
//         message: 'No file uploaded'
//       });
//     } else {
//       let file = req.files.ticketFile;
//       console.log(`file.name= ${file.name}`)
//       const filePath = 'attachments/' + file.name
//       // literally upload file to filePath
//       file.mv(`./public/${filePath}`)

//       res.send({
//         status: true,
//         message: 'File is uploaded',
//         data: {
//           name: file.name,
//           mimetype: file.mimetype,
//           size: file.size,
//           path: filePath
//         }
//       })
//     }
//   } catch (err) {
//     console.error(err)
//     res.status(500).send(err);
//   }
// });

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

module.exports = router