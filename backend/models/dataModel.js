const mongoose = require('mongoose')

const Schema = mongoose.Schema

const dataSchema = new Schema({
    _id: {
        type: String,
        required: true
    },
    data: {}
}, { timestamps: true })

module.exports = mongoose.model('Data', dataSchema)