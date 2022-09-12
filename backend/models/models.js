const uuid = require('uuid')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

// collection for intakeData
const clientDataSchema = new Schema({
  _id: { type: String, default: uuid.v1 },
  firstName: {
    type: String,
    required: true
  },
  middleName: {
    type: String
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String
  },
  phoneNumber: {
    primary: {
      type: String,
      required: true
    },
    alternate: {
      type: String
    }
  },
  address: {
    line1: {
      type: String
    },
    line2: {
      type: String
    },
    city: {
      type: String,
      required: true
    },
    county: {
      type: String
    },
    zip: {
      type: String
    }
  },
  orgs_registered: [{
    type: String
  }]
}, {
  collection: 'client',
  timestamps: true
})

// collection for org
const orgDataSchema = new Schema({
  _id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  }
}, {
  collection: 'org'
})

// collection for events
const eventDataSchema = new Schema({
  _id: { type: String, default: uuid.v1 },
  org_id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  services: [{
    type: String
  }],
  date: {
    type: Date,
    required: true
  },
  address: {
    line1: {
      type: String
    },
    line2: {
      type: String
    },
    city: {
      type: String
    },
    county: {
      type: String
    },
    zip: {
      type: String
    }
  },
  description: {
    type: String
  },
  attendees: [{
    type: String
  }]
}, {
  collection: 'event'
})

// create models from mongoose schemas
const clients = mongoose.model('client', clientDataSchema)
const orgs = mongoose.model('org', orgDataSchema)
const events = mongoose.model('event', eventDataSchema)

// package the models in an object to export
module.exports = { clients, orgs, events }
