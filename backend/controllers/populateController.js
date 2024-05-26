const Link = require('../models/linkModel')
const Program = require('../models/programModel')
const Data = require('../models/dataModel')
const UserCourses = require('../models/userCoursesModel')
const User = require('../models/userModel')

const generateLinks = async (req, res) => {
    //Fetch programs
    const programs = await Program.find({})
    if (!programs || programs.length == 0) {
        res.status(400).json({ error: "Failed to fetch programs." });
    }
    var names = [];
    for (let i = 0; i < programs.length; i++) {
        program = programs[i];
        names.push(program.name);
    }

    await Link.deleteMany({});

    //Create Links
    for (let i = 0; i < names.length; i++) {
        for (let j = 0; j < names.length; j++) {
            if (i == j) {
                continue;
            }
            const linkObj = { source: names[i], target: names[j], value: 4 }
            try {
                const link = await Link.create(linkObj);
            } catch (error) {
                res.status(400).json({ error: "Failed to create link." });
                return;
            }
        }
    }
    res.status(200).json({ success: true })
}

const generateLinks2 = async (_id) => {
    const user = (await User.find({ _id }))[0]; //error check
    var userCourses = await UserCourses.find({ _id });
    if(userCourses === undefined || userCourses.length == 0) {
        await UserCourses.create({_id, core: [], critical_tracking: []})
        userCourses = await UserCourses.find({ _id });
    }
    userCourses = userCourses[0];

    //Fetch programs
    const programs = await Program.find({})
    
    if (!programs || programs.length == 0) {
        return null;
    }
    var names = [];
    programs.push({name: `${user.firstName} ${user.lastName}`, core: userCourses.core , critical_tracking: userCourses.critical_tracking, college: "You"}); //need to fix
    for (let i = 0; i < programs.length; i++) {
        program = programs[i];
        names.push(program.name);
    }

    var links = [];

    //Create Links
    for (let i = 0; i < names.length; i++) {
        const sourceProgram = (programs.filter((item) => item.name == names[i]))[0];
        for (let j = 0; j < names.length; j++) {
            if (i == j) {
                continue;
            }
            const targetProgram = (programs.filter((item) => item.name == names[j]))[0];
            const similarity = calculateSimilarity(sourceProgram, targetProgram);
            console.log(`${names[i]} => ${names[j]} = ${similarity}`);
            const linkObj = { source: names[i], target: names[j], value: calculateSimilarity(sourceProgram, targetProgram) }
            links.push(linkObj)
        }
    }
    return links;
}

function calculateSimilarity(source, target) {
    let criticalMin = Math.min(source.critical_tracking.length, target.critical_tracking.length);
    let coreMin = Math.min(source.core.length, target.core.length);
    
    let criticalScore = count_similarities(source.critical_tracking, target.critical_tracking) / criticalMin * 6;
    let coreScore = count_similarities(source.core, target.core) / coreMin * 7;

    let score = Math.round(criticalScore + coreScore);
    score = score == 0 ? 1 : score;
    return score > 10 ? 10 : score;
}

function count_similarities(arrayA, arrayB) {
    var matches = 0;
    for (i=0;i<arrayA.length;i++) {
        if (arrayB.indexOf(arrayA[i]) != -1)
            matches++;
    }
    return matches;
}

var collegeColorCode = {}
collegeColorCode['You'] = 0;
collegeColorCode['Herbert Wertheim College of Engineering'] = 1;
collegeColorCode['College of Liberal Arts and Sciences'] = 2;
collegeColorCode['College of the Arts'] = 3;
collegeColorCode['Heavener School of Business'] = 4;
collegeColorCode['College of Health and Human Performance'] = 5;

function encodeCollege(college) {
    return collegeColorCode[college];
}

const generateData = async (req, res) => {
    //console.log(await generateLinks2());
    const { _id } = req.user._id;
    const user = (await User.find({ _id }))[0]; //error check

    const programs = await Program.find({})
    if (!programs || programs.length == 0) {
        res.status(400).json({ error: "Failed to fetch programs." });
    }
    programs.push({name: `${user.firstName} ${user.lastName}`, core: [], critical_tracking: [], college: "You"})

    var data = { nodes: [] };
    //Generate Links
    const allLinks = await generateLinks2(_id);
    
    for (let i = 0; i < programs.length; i++) {
        data.nodes.push({ id: programs[i].name, group: encodeCollege(programs[i].college)});
        var links = allLinks.filter((item) => item.source == programs[i].name);
        links = links.map(function (item) {
            return {
                source: item.source,
                target: item.target,
                value: item.value
            }
        });
        data[programs[i].name] = links;
    }

    try {
        const search = await Data.find({ _id });
        var newData;
        if (search === undefined || search.length == 0) {
            newData = await Data.create({ _id, data });
        } else {
            const filter = _id;
            const update = { data };
            newData = await Data.findOneAndUpdate(filter, update, {
                new: true
            });
        }
        res.status(200).json(newData)
    } catch (error) {
        res.status(400).json({ error: "Failed to create data." });
        return;
    }
}

module.exports = {
    generateLinks,
    generateData
}