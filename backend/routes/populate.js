const express = require('express')
const {
    generateLinks,
    generateData
} = require('../controllers/populateController')
const router = express.Router()

router.post('/links', generateLinks)
router.post('/data', generateData)

module.exports = router