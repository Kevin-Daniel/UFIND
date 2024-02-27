const Link = require('../models/linkModel')

const getLinks = async (req, res) => {
    const links = await Link.find({})
    
    res.status(200).json(links)
}

const createLink = async (req, res) => {
    const {source, target, value} = req.body

    try {
        const link = await Link.create({source, target, value})
        res.status(200).json(link)
    } catch(error) {
        res.status(400).json({error: error.message})
    }
}

module.exports = {
    getLinks,
    createLink
}