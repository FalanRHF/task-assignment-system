const router = require('express').Router()

router.get('/dummy', (req, res) => {
  res.json({
    status: "success",
    name: "dummy"
  })
})


module.exports = router