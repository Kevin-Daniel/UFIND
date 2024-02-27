const Link = require('../models/linkModel')
const Program = require('../models/programModel')
const Data = require('../models/dataModel')

const generateLinks = async (req, res) => {
    //Fetch programs
    const programs = await Program.find({})
    if(!programs || programs.length == 0) {
        res.status(400).json({error: "Failed to fetch programs."});
    }
    var names = [];
    for(let i = 0; i < programs.length; i++){
        program = programs[i];
        names.push(program.name);
    }

    await Link.deleteMany({});

    //Create Links
    for(let i = 0; i < names.length; i++) {
        for(let j = 0; j < names.length; j++) {
            if(i == j) {
                continue;
            }
            const linkObj = {source: names[i], target: names[j], value: 4}
            try {
                const link = await Link.create(linkObj);
            } catch(error) {
                res.status(400).json({error: "Failed to create link."});
                return;
            }   
        }
    }
    res.status(200).json({success: true})
}

//Add function to fetch list of names
const generateData = async (req, res) => {
    const programs = await Program.find({})
    if(!programs || programs.length == 0) {
        res.status(400).json({error: "Failed to fetch programs."});
    }
    var names = [];
    for(let i = 0; i < programs.length; i++){
        names.push(programs[i].name);
    }

    var data = {nodes: []};
    //Generate Links
    for(let i = 0; i < names.length; i++) {
        data.nodes.push({id: names[i], group: 1});
        var links = await Link.find({source: names[i]})
        links = links.map(function(item) { 
            return {
                source: item.source,
                target: item.target,
                value: item.value
            }
        });
        data[names[i]] = links;
    }

    await Data.deleteMany({});

    try {
        Data.create({data: data})
        res.status(200).json(data)
    } catch(error) {
        res.status(400).json({error: "Failed to create data."});
        return;
    }  
}

module.exports = {
    generateLinks,
    generateData
}