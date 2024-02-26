const express = require('express')
const {
    getData,
    createData
} = require('../controllers/dataController')
const router = express.Router()

//GET all link
router.get('/', getData)

//POST a single program
router.post('/', createData)

module.exports = router