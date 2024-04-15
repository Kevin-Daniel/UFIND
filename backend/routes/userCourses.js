const express = require('express');
const requireAuth = require('../middleware/requireAuth');

const {
    getUserCourses,
    updateUserCourses
} = require('../controllers/userCoursesController')
const router = express.Router()
router.use(requireAuth);
router.get('/fetch', getUserCourses)
router.post('/update', updateUserCourses)

module.exports = router