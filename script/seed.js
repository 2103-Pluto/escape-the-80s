'use strict'

const {db, models: {Record} } = require('../server/db')

const data = [
  { name: 'AAA', score: 50, level: 1 },
  { name: 'JSA', score: 108, level: 2 },
  { name: 'JSA', score: 36, level: 1 },
  { name: 'ELM', score: 120, level: 1 },
  { name: 'ISC', score: 15, level: 1 },
  { name: 'ISC', score: 134, level: 2 },
  { name: 'ISC', score: 89, level: 1 },
  { name: 'MHZ', score: 29, level: 1 },
  { name: 'MHZ', score: 125, level: 2 },
  { name: 'BRE', score: 52, level: 1 },
  { name: 'BRE', score: 140, level: 2 },
  { name: 'MHZ', score: 100, level: 2 },
  { name: 'IOP', score: 90, level: 1 },
  { name: 'GNH', score: 109, level: 2 },
  { name: 'GNJ', score: 78, level: 1 },
  { name: 'ZZG', score: 97, level: 1 },
  { name: 'FIT', score: 164, level: 2 },
  { name: 'PUN', score: 60, level: 1 },
  { name: 'MKP', score: 79, level: 1 },
  { name: 'AAB', score: 91, level: 1 }
]

/**
 * seed - this function clears the database, updates tables to
 *      match the models, and populates the database.
 */
async function seed() {
  await db.sync({ force: true }) // clears db and matches models to tables
  console.log('db synced!')

  // Creating Users
  const records = await Promise.all(data.map((record) => Record.create(record)))

  console.log(`seeded successfully`)
}

/*
 We've separated the `seed` function from the `runSeed` function.
 This way we can isolate the error handling and exit trapping.
 The `seed` function is concerned only with modifying the database.
*/
async function runSeed() {
  console.log('seeding...')
  try {
    await seed()
  } catch (err) {
    console.error(err)
    process.exitCode = 1
  } finally {
    console.log('closing db connection')
    await db.close()
    console.log('db connection closed')
  }
}

/*
  Execute the `seed` function, IF we ran this module directly (`node seed`).
  `Async` functions always return a promise, so we can use `catch` to handle
  any errors that might occur inside of `seed`.
*/
if (module === require.main) {
  runSeed()
}

// we export the seed function for testing purposes (see `./seed.spec.js`)
module.exports = seed
