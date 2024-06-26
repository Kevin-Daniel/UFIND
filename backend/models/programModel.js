const mongoose = require('mongoose')

const Schema = mongoose.Schema

const programSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    critical_tracking: {
        type: [String],
    },
    core: {
        type: [String],
    },
    college: {
        type: String,
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('Program', programSchema)