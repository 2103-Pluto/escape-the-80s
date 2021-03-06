const router = require('express').Router()
const Sequelize = require('sequelize')
const { models: { Record }} = require('../db')
module.exports = router

//GET route for top 10 records
router.get('/', async (req, res, next) => {
  try {
    const records = await Record.findAll({
      limit: 10,
      order: Sequelize.literal('score DESC'),
      attributes: ['id', 'name', 'score', 'level']
    })
    res.status(200).send(records)
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
    res.status(200).send(record)
  } catch (err) {
    next(err)
  }
})

//POST route to add a record
router.post('/', async (req, res, next) => {
  try {
    const { name, score, level } = req.body;
    const record = await Record.create({
      name,
      score,
      level
    })
    res.status(201).send(record)
  } catch (err) {
    next(err)
  }
})
