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
  phoneNumbers: {
    primaryPhone: {
      type: String,
      // https://stackoverflow.com/a/18091377
      match: /\(?\d{3}\)?-? *\d{3}-? *-?\d{4}/,
      required: true
    },
    secondaryPhone: {
      type: String,
      match: /\(?\d{3}\)?-? *\d{3}-? *-?\d{4}/
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

// collection for eventData
const eventDataSchema = new Schema({
  _id: { type: String, default: uuid.v1 },
  org_id: {
    type: String,
    required: true
  },
  eventName: {
    type: String,
    required: true
  },
  services: {
    type: Array
  },
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
const primarydata = mongoose.model('client', clientDataSchema)
const orgdata = mongoose.model('org', orgDataSchema)
const eventdata = mongoose.model('event', eventDataSchema)

// package the models in an object to export
module.exports = { primarydata, orgdata, eventdata }
