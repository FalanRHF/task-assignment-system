const router = require('express').Router()

router.use('/auth', require('./modules/Auth'))
router.use('/helpdesk', require('./modules/Helpdesk'))
router.use('/clientprofile', require('./modules/ClientProfile'))
router.use('/task', require('./modules/Task'))

module.exports = router