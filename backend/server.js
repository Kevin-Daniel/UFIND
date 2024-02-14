const express = require('express')

// express app
const app = express()
const programRoutes = require('./routes/workouts.js')

// middleware
app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

// routes
app.use('/api/programs', programRoutes)

// listen for requrests
app.listen(4000, () => {
    console.log('listening on port 4000!!!')
})