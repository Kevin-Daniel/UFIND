const express = require('express')

const router = express.Router()

//GET all programs
router.get('/', (req, res) => {
    res.json({msg: 'GET all programs'})
})

//GET a single program
router.get('/:id', (req, res) => {
    res.json({msg: 'GET a single program'})
})

module.exports = router