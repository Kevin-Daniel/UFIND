const Data = require('../models/dataModel')

const getData = async (req, res) => {
    const data = await Data.find({})
    if(data.length > 0){
        res.status(200).json(data['0']);
    } else {
        res.status(400).json({error: "No data found"})
    }
    
}


const createData = async (req, res) => {
    const { data } = req.body

    try {
        const data = await Data.create(data)
        res.status(200).json(data)
    } catch(error) {
        res.status(400).json({error: error.message})
    }
}

module.exports = {
    getData,
    createData
}