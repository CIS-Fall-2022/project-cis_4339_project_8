const express = require('express')
const router = express.Router()

// importing data model schemas
const { events } = require('../models/models')

// GET all events
router.get('/', (req, res, next) => {
  events
    .find((error, data) => {
      if (error) {
        return next(error)
      } else {
        return res.json(data)
      }
    })
    .sort({ updatedAt: -1 })
    .limit(10)
})

// GET single event by ID
router.get('/id/:id', (req, res, next) => {
  events.find({ _id: req.params.id }, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

// GET events based on search query
// Ex: '...?name=Food&searchBy=name'
router.get('/search/', (req, res, next) => {
  let dbQuery = ''
  if (req.query.searchBy === 'name') {
    dbQuery = { name: { $regex: `^${req.query.name}`, $options: 'i' } }
  } else if (req.query.searchBy === 'date') {
    dbQuery = {
      date: req.query.eventDate
    }
  }
  events.find(dbQuery, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

// GET events for which a client is signed up
router.get('/client/:id', (req, res, next) => {
  events.find({ attendees: req.params.id }, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

// POST new event
router.post('/', (req, res, next) => {
  events.create(req.body, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

// PUT update event
router.put('/:id', (req, res, next) => {
  events.findOneAndUpdate({ _id: req.params.id }, req.body, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
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

// DELETE event by ID
router.delete('/:id', (req, res, next) => {
  events.findOneAndRemove(
    { _id: req.params.id },
    (error) => {
      if (error) {
        return next(error)
      } else {
        res.send('Event is deleted.')
      }
    }
  )
})

// DELETE client from event's client array using event name and client first and last name
// I attempted to try this by first requiring the event name (search for event) then the first and last name of the client to remove
// maybe somehow program the client id into this to be more accurate
// Wasn't sure whether to use $sunset or $pull
router.put('/removeorg', (req, res, next) => {
  let queryevent = ''
  let dbQuery = ''
  if (req.query.searchBy === 'event') {
    queryevent = { 'attendees.client': { $regex: `^${req.query['attendees.client']}`, $options: 'i' } }
    dbQuery = { firstName: { $regex: `^${req.query.firstName}`, $options: 'i' }, lastName: { $regex: `^${req.query.lastName}`, $options: 'i' } }
    events.findOneAndUpdate(
      { queryevent },
      { $pull: { dbQuery } },
      (error) => {
        if (error) {
          return next(error)
        } else {
          res.send('Client removed from organization.')
        }
      }
    )
  }
})

// Possible other way to delete event: by event name

module.exports = router
