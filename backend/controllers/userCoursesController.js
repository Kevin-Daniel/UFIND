const UserCourses = require('../models/userCoursesModel')

// get a single program
const getUserCourses = async (req, res) => {
    const { _id } = req.user._id;

    const userCourses = await UserCourses.find({_id})

    if(userCourses === undefined || userCourses.length == 0) {
        return await createUserCourses(req, res);
        //return res.status(404).json({error: "No such program"})
    }

    res.status(200).json(userCourses);
}

// create new program
const createUserCourses = async (req, res) => {
    const { _id } = req.user._id;

    // add program to db
    try {
        const userCourses = await UserCourses.create({_id: _id, courses: []})
        res.status(200).json(userCourses)
    } catch(error) {
        res.status(400).json({error: error.message})
    }
}

const updateUserCourses = async (req, res) => {
    const { _id } = req.user._id;
    const {courses} = req.body;
    console.log(courses);
    try {
        const filter = _id;
        const update = {courses: courses};
        const userCourses = await UserCourses.findOneAndUpdate(filter, update, {
            new: true
          });
          res.status(200).json(userCourses)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

module.exports = {
    getUserCourses,
    updateUserCourses
}