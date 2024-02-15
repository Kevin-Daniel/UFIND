const Program = require('../models/programModel')

// get all programs
const getPrograms = async (req, res) => {
    const programs = await Program.find({})
    
    res.status(200).json(programs)
}

// get a single program
const getProgram = async (req, res) => {
    const { name } = req.params

    const program = await Program.find({name: name})

    if(program === undefined || program.length == 0) {
        return res.status(404).json({error: "No such program"})
    }

    res.status(200).json(program)
}

// create new program
const createProgram = async (req, res) => {
    const {name, required_courses} = req.body

    // add program to db
    try {
        const program = await Program.create({name, required_courses})
        res.status(200).json(program)
    } catch(error) {
        res.status(400).json({error: error.message})
    }
}

module.exports = {
    getPrograms,
    getProgram,
    createProgram
}