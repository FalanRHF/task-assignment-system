const express = require('express')
const router = express.Router()
const cors = require('cors')
const fileUpload = require('express-fileupload')
global.db = require('../database')

router.use(cors())
router.use('/files', express.static('public'))
router.use(fileUpload({
  createParentPath: true
}))

router.use('/web', require('./web/WebRouter'))
router.use('/mobile', require('./mobile/MobileRouter'))

module.exports = router

