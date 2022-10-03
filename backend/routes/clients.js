const express = require('express')
const router = express.Router()

// importing data model schemas
const { clients } = require('../models/models')

// GET all clients
router.get('/', (req, res, next) => {
  clients.find(
    (error, data) => {
      if (error) {
        return next(error)
      } else {
        return res.json(data)
      }
    }
  ).sort({ updatedAt: -1 }).limit(10)
})

// GET single client by ID
router.get('/id/:id', (req, res, next) => {
  clients.find(
    { _id: req.params.id },
    (error, data) => {
      if (error) {
        return next(error)
      } else {
        res.json(data)
      }
    }
  )
})

// GET entries based on search query
// Ex: '...?firstName=Bob&lastName=&searchBy=name'
router.get('/search', (req, res, next) => {
  let dbQuery = ''
  if (req.query.searchBy === 'name') {
    dbQuery = { firstName: { $regex: `^${req.query.firstName}`, $options: 'i' }, lastName: { $regex: `^${req.query.lastName}`, $options: 'i' } }
  } else if (req.query.searchBy === 'number') {
    dbQuery = {
      'phoneNumber.primary': { $regex: `^${req.query['phoneNumber.primary']}`, $options: 'i' }
    }
  };
  clients.find(
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

// POST
router.post('/', (req, res, next) => {
  clients.create(
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

// PUT update (make sure req body doesn't have the id)
router.put('/:id', (req, res, next) => {
  clients.findOneAndUpdate(
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

// DELETE client by ID
router.delete('/:id', (req, res, next) => {
  clients.findOneAndRemove(
    { _id: req.params.id},
    (error) => {
      if (error) {
        return next(error)
      } else {
        res.send('Client is deleted.')
      }
    }
  )
})

module.exports = router
