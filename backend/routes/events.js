const express = require('express')
const router = express.Router()

// importing data model schemas
const { events } = require('../models/models')

// GET 10 most recent events for org
router.get('/', (req, res, next) => {
  const dbQuery = {}

  // optionally filter by org
  if (req.query.org) {
    dbQuery.orgs = req.query.org
  }

  events
    .find(dbQuery, (error, data) => {
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
  const dbQuery = { org: req.query.org }
  switch (req.query.searchBy) {
    case 'name':
      dbQuery.name = { $regex: `^${req.query.name}`, $options: 'i' }
      break
    case 'date':
      dbQuery.date = req.query.eventDate
      break
    default:
      return res.status(400).send('invalid searchBy')
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
  const dbQuery = { attendees: req.params.id }

  // optionally filter by org
  if (req.query.org) {
    dbQuery.org = req.query.org
  }

  events.find(dbQuery, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

// GET org event attendance for the past two months
router.get('/attendance', (req, res, next) => {
  const twoMonthsAgo = new Date()
  twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2)
  events
    .find(
      { org: req.query.org, date: { $gte: twoMonthsAgo } },
      { name: 1, attendees: 1 },
      (error, data) => {
        if (error) {
          return next(error)
        } else {
          // kinda hacky, replaces array of attendees with an int of the array length
          data = data.map((event) => {
            return { ...event._doc, attendees: event.attendees.length }
          })
          res.json(data)
        }
      }
    )
    .sort({ updatedAt: -1 })
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
  events.findByIdAndUpdate(req.params.id, req.body, (error, data) => {
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
                res.send('Client added to event')
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
                res.send('Client deregistered with event')
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
      res.send('Event deleted')
    }
  })
})

module.exports = router
