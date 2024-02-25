const express = require('express')
const {
    getPrograms,
    getProgram,
    createProgram
} = require('../controllers/programController')
const router = express.Router()

//GET all programs
router.get('/', getPrograms)

//GET a single program
router.get('/:name', getProgram)

//POST a single program
router.post('/', createProgram)

module.exports = router