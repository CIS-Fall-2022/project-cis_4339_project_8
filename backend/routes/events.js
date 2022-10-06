const express = require('express')
const router = express.Router()

// importing data model schemas
const { events } = require('../models/models')

// GET 10 most recent events for org
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
router.put('/update/:id', (req, res, next) => {
  events.findOneAndUpdate({ _id: req.params.id }, req.body, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

// PUT add attendee to event
router.put('/register', (req, res, next) => {
  events.find(
    { _id: req.query.event, attendees: req.query.client },
    (error, data) => {
      if (error) {
        return next(error)
      } else {
        // only add attendee if not yet signed up
        if (!data.length) {
          events.findByIdAndUpdate(
            req.query.event,
            { $push: { attendees: req.query.client } },
            (error, data) => {
              if (error) {
                console.log(error)
                return next(error)
              } else {
                res.status(200).send('Client added to event')
              }
            }
          )
        } else {
          res.status(400).send('Client already added to event')
        }
      }
    }
  )
})

// PUT remove attendee from event
router.put('/deregister', (req, res, next) => {
  events.find(
    { _id: req.query.event, attendees: req.query.client },
    (error, data) => {
      if (error) {
        return next(error)
      } else {
        // only remove attendee if already registered
        if (data.length) {
          events.findByIdAndUpdate(
            req.query.event,
            { $pull: { attendees: req.query.client } },
            (error, data) => {
              if (error) {
                console.log(error)
                return next(error)
              } else {
                res.status(200).send('Client deregistered with event')
              }
            }
          )
        } else {
          res.status(400).send('Client already unregistered with event')
        }
      }
    }
  )
})

// hard DELETE client by ID, as per project specifications
router.delete('/:id', (req, res, next) => {
  events.findByIdAndDelete(req.params.id, (error, data) => {
    if (error) {
      return next(error)
    } else if (!data) {
      res.status(400).send('Event not found')
    } else {
      res.status(200).send('Event deleted')
    }
  })
})

module.exports = router
