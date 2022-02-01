const router = require('express').Router()

//configure modules route
router.use('/task', require('./modules/Task'))
router.use('/employee', require('./modules/Employee'))
router.use('/company', require('./modules/Company'))
router.use('/kpi', require('./modules/Assessment'))
router.use('/summary', require('./modules/Analysis'))

module.exports = router