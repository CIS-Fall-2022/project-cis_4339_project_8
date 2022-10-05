const express = require('express')
const mongoose = require('mongoose') //require mongoose library functionaility
const morgan = require('morgan') // better debugging and 

const cors = require('cors')
// allow using a .env file
require('dotenv').config() //require the dotenv

// creates a new instance of express application
const app = express()

// add cors header to the server
app.use(
  cors({
    origin: '*'
  })
)

const db = process.env.CLOUD ? process.env.MONGO_CLOUD : process.env.MONGO_LOCAL

// sets up mongoose for the mongoDB connection
mongoose
  .connect(db)
  .then(() => {
    console.log('Database connection Success!')
  })
  .catch((err) => {
    console.error('Mongo Connection Error', err)
  })

// declare port number for the api
const PORT = process.env.PORT || 3000

// setup and access request body
app.use(express.json())
app.use(morgan('dev'))

// setup middle ware for routes
app.use('/clients', require('./routes/clients'))
app.use('/events', require('./routes/events'))

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})

// error handler
app.use(function (err, req, res, next) {
  // logs error and error code to console
  console.error(err.message, req)
  if (!err.statusCode) {
    err.statusCode = 500
  }
  res.status(err.statusCode).send(err.message)
})
