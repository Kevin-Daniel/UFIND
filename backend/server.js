require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')

// express app
const app = express()
const programRoutes = require('./routes/programs.js')
const linkRoutes = require('./routes/links.js')
const populateRoutes = require('./routes/populate.js')
const dataRoutes = require('./routes/data.js')
const userRoutes = require('./routes/user.js');
const userCoursesRoutes = require('./routes/userCourses.js');

// middleware
app.use(express.json())

app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

// routes
app.use('/api/programs', programRoutes)
app.use('/api/links', linkRoutes)
app.use('/api/populate', populateRoutes)
app.use('/api/data', dataRoutes)
app.use('/api/user', userRoutes);
app.use('/api/userCourses', userCoursesRoutes);

// connect to db
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        // listen for requrests
        app.listen(process.env.PORT, () => {
            console.log('connected to db & listening on port', process.env.PORT)
        })
    })
    .catch((error) => {
        console.log(error)
    })

