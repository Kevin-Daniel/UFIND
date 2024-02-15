const mongoose = require('mongoose')

const Schema = mongoose.Schema

const programSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    required_courses: {
        type: [String],
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('Program', programSchema)