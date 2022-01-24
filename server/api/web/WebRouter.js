const router = require('express').Router()

//configure modules route
router.use('/task', require('./modules/Task'))
router.use('/kpi', require('./modules/Assessment'))
router.use('/summary', require('./modules/Analysis'))

module.exports = router