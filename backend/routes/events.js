const express = require('express')
const router = express.Router()

// importing data model schemas
const { events } = require('../models/models')

// GET all entries
router.get('/', (req, res, next) => {
  events.find(
    (error, data) => {
      if (error) {
        return next(error)
      } else {
        return res.json(data)
      }
    }
  ).sort({ updatedAt: -1 }).limit(10)
})

// GET single entry by ID
router.get('/id/:id', (req, res, next) => {
  events.find({ _id: req.params.id }, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

// GET entries based on search query
// Ex: '...?name=Food&searchBy=name'
router.get('/search/', (req, res, next) => {
  let dbQuery = ''
  if (req.query.searchBy === 'name') {
    dbQuery = { name: { $regex: `^${req.query.name}`, $options: 'i' } }
  } else if (req.query.searchBy === 'date') {
    dbQuery = {
      date: req.query.eventDate
    }
  };
  events.find(
    dbQuery,
    (error, data) => {
      if (error) {
        return next(error)
      } else {
        res.json(data)
      }
    }
  )
})

// GET events for which a client is signed up
router.get('/client/:id', (req, res, next) => {
  events.find(
    { attendees: req.params.id },
    (error, data) => {
      if (error) {
        return next(error)
      } else {
        res.json(data)
      }
    }
  )
})

// POST
router.post('/', (req, res, next) => {
  events.create(
    req.body,
    (error, data) => {
      if (error) {
        return next(error)
      } else {
        res.json(data)
      }
    }
  )
})

// PUT
router.put('/:id', (req, res, next) => {
  events.findOneAndUpdate(
    { _id: req.params.id },
    req.body,
    (error, data) => {
      if (error) {
        return next(error)
      } else {
        res.json(data)
      }
    }
  )
})

// PUT add attendee to event
router.put('/addAttendee/:id', (req, res, next) => {
  // only add attendee if not yet signed up
  events.find(
    { _id: req.params.id, attendees: req.body.attendee },
    (error, data) => {
      if (error) {
        return next(error)
      } else {
        if (data.length === 0) {
          events.updateOne(
            { _id: req.params.id },
            { $push: { attendees: req.body.attendee } },
            (error, data) => {
              if (error) {
                console.log(error)
                return next(error)
              } else {
                res.json(data)
              }
            }
          )
        }
      }
    }
  )
})

module.exports = router
