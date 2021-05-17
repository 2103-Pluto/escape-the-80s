//this is the access point for all things database related!

const db = require('./db')

const Record = require('./models/Record')

//associations could go here!

module.exports = {
  db,
  models: {
    Record,
  },
}
