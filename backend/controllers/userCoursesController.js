const UserCourses = require('../models/userCoursesModel')

// get a single program
const getUserCourses = async (req, res) => {
    const { _id } = req.user._id;

    var userCourses = await UserCourses.find({_id})

    if(userCourses === undefined || userCourses.length == 0) {
        try {
            await UserCourses.create({_id, core: [], critical_tracking: []})
            userCourses = await UserCourses.find({_id})
            res.status(200).json(userCourses);
        } catch (error) {
            res.status(400).json({error: error.message})
        }
    } else {
        res.status(200).json(userCourses);
    }
}

const createUserCourses = async (req, res) => {
    const { _id } = req.user._id;

    // add program to db
    try {
        console.log("creating user");
        const userCourses = await UserCourses.create({_id: _id, core: [], critical_tracking: []})
        res.status(200).json(userCourses)
    } catch(error) {
        res.status(400).json({error: error.message})
    }
}

const updateUserCourses = async (req, res) => {
    const { _id } = req.user._id;
    const { core, critical_tracking} = req.body;
    
    try {
        const filter = _id;
        const update = {core, critical_tracking};
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