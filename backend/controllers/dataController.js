const Data = require('../models/dataModel')
const {
    generateLinks,
    generateData
} = require('../controllers/populateController')

const getData = async (req, res) => {
    const { _id } = req.user._id;
    const data = await Data.find({_id})
    if(data.length > 0){
        res.status(200).json(data['0']);
    } else {
        return await generateData(req, res);
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