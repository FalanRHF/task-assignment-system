const routes = require('express').Router();
const db = require("../db")
const path = require('path')
const fs = require('fs').promises;

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

// routes.get("/", async (req, res) => {
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


routes.post("/postnewticketwithimage", async (req, res) => {
  try {
    console.log(`POST url: ${req.originalUrl}`)
    const { tc_id, tc_pjcode, tc_title, tc_detail, tc_createdat, tc_status, tc_filepath } = req.body;
    const queryString = `INSERT INTO ticket(tc_id,tc_pjcode,tc_title,tc_detail,tc_createdat,tc_status,tc_filepath) VALUES('${tc_id}','${tc_pjcode}','${tc_title}','${tc_detail}','${tc_createdat}','${tc_status}','${tc_filepath}') RETURNING *`
    console.log(queryString)
    const query = await db.query(queryString)
    res.json(query.rows);
    console.log(query.rows);
  } catch (error) {
    console.error(error.message);
  }
});

routes.post("/uploadfile", async (req, res) => {
  try {
    if (!req.files) {
      res.send({
        status: false,
        message: 'No file uploaded'
      });
    } else {
      let image = req.files.image;
      console.log(`image.name= ${image.name}`)
      const filePath = './uploads/helpdesk/' + image.name
      image.mv(filePath)

      res.send({
        status: true,
        message: 'File is uploaded',
        data: {
          name: image.name,
          mimetype: image.mimetype,
          size: image.size,
          path: filePath
        }
      })
    }
  } catch (err) {
    console.error(err)
    res.status(500).send(err);
  }
});

routes.post("/getfile", async (req, res) => {
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