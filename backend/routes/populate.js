const express = require('express');
const requireAuth = require('../middleware/requireAuth');

const {
    generateLinks,
    generateData
} = require('../controllers/populateController')
const router = express.Router()

router.post('/links', generateLinks)

router.use(requireAuth);

router.post('/data', generateData)

module.exports = router