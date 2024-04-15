const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userCoursesSchema = new Schema({
    _id: {
        type: String,
        required: true
    },
    courses: {
        type: [String],
        required: true
    }
})

module.exports = mongoose.model("UserCourses", userCoursesSchema);