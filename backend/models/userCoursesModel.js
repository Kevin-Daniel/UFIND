const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userCoursesSchema = new Schema({
    _id: {
        type: String,
        required: true
    },
    core: {
        type: [String],
        required: true
    },
    critical_tracking: {
        type: [String],
        required: true
    }
})

module.exports = mongoose.model("UserCourses", userCoursesSchema);