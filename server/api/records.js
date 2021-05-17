const router = require('express').Router()
const { models: { Record }} = require('../db')
module.exports = router

//GET route for all records
router.get('/', async (req, res, next) => {
  try {
    const records = await Record.findAll({
      attributes: ['id', 'name', 'score', 'level']
    })
    res.json(records)
  } catch (err) {
    next(err)
  }
})

//GET rout to find a user by id
router.get('/:id', async (req, res, next) => {
  try {
    const record = await Record.findByPk(req.params.id, {
      attributes: ['id', 'name', 'score', 'level']
    })
    res.json(record)
  } catch (err) {
    next(err)
  }
})

