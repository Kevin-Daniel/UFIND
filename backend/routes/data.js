const express = require('express');
const requireAuth = require('../middleware/requireAuth');
const {
    getData,
    createData
} = require('../controllers/dataController')
const router = express.Router()
router.use(requireAuth);
//GET all link
router.get('/', getData)

//POST a single program
router.post('/', createData)

module.exports = router