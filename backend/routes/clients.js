const express = require('express')
const router = express.Router()

// importing data model schemas
const { clients } = require('../models/models')

// GET all clients
router.get('/', (req, res, next) => {
  clients
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

// GET single client by ID
router.get('/id/:id', (req, res, next) => {
  clients.find({ _id: req.params.id }, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

// GET entries based on search query
// Ex: '...?firstName=Bob&lastName=&searchBy=name'
router.get('/search', (req, res, next) => {
  let dbQuery = ''
  if (req.query.searchBy === 'name') {
    dbQuery = {
      firstName: { $regex: `^${req.query.firstName}`, $options: 'i' },
      lastName: { $regex: `^${req.query.lastName}`, $options: 'i' }
    }
  } else if (req.query.searchBy === 'number') {
    dbQuery = {
      'phoneNumber.primary': {
        $regex: `^${req.query['phoneNumber.primary']}`,
        $options: 'i'
      }
    }
  }
  clients.find(dbQuery, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

// POST
router.post('/', (req, res, next) => {
  clients.create(req.body, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

// PUT update client
router.put('/update/:id', (req, res, next) => {
  clients.findOneAndUpdate({ _id: req.params.id }, req.body, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

// PUT add existing client to org
router.put('/register/:org', (req, res, next) => {
  clients.find({ _id: req.query.id, orgs: req.params.org }, (error, data) => {
    if (error) {
      return next(error)
    } else {
      // only add attendee if not yet signed up
      if (!data.length) {
        clients.findByIdAndUpdate(
          req.query.id,
          { $push: { orgs: req.params.org } },
          (error, data) => {
            if (error) {
              return next(error)
            } else {
              res.status(200).send('Client registered with org')
            }
          }
        )
      } else {
        res.status(400).send('Client already registered with org')
      }
    }
  })
})

// PUT remove existing client from org
router.put('/deregister/:org', (req, res, next) => {
  clients.find({ _id: req.query.id, orgs: req.params.org }, (error, data) => {
    if (error) {
      return next(error)
    } else {
      // only remove client if already registered with org
      if (data.length) {
        clients.findByIdAndUpdate(
          req.query.id,
          { $pull: { orgs: req.params.org } },
          (error, data) => {
            if (error) {
              console.log(error)
              return next(error)
            } else {
              res.status(200).send('Client deregistered with org')
            }
          }
        )
      } else {
        res.status(400).send('Client already unregistered with org')
      }
    }
  })
})

// hard DELETE client by ID, as per project specifications
router.delete('/:id', (req, res, next) => {
  clients.findByIdAndDelete(req.params.id, (error, data) => {
    if (error) {
      return next(error)
    } else if (!data) {
      res.status(400).send('Client not found')
    } else {
      res.status(200).send('Client deleted')
    }
  })
})

module.exports = router
