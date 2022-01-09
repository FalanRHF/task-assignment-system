const router = require('express').Router()

//configure modules route
router.use('/task', require('./modules/Task'))

module.exports = router