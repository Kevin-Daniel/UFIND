const mongoose = require('mongoose')

const Schema = mongoose.Schema

const dataSchema = new Schema({
    data: {}
}, { timestamps: true })

module.exports = mongoose.model('Data', dataSchema)