const express = require('express')
const {
    getLinks,
    createLink
} = require('../controllers/linkController')
const router = express.Router()

router.get('/', getLinks)
router.post('/', createLink)

module.exports = router