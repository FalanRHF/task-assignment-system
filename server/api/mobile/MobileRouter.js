const router = require('express').Router()

router.use('/auth', require('./modules/Auth'))
router.use('/helpdesk', require('./modules/Helpdesk'))
router.use('/profile', require('./modules/Profile'))
router.use('/task', require('./modules/Task'))

module.exports = router