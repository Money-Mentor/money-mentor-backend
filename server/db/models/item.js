const Sequelize = require('sequelize')
const db = require('../db')

const Item = db.define('item', {
  bank: {
    type: Sequelize.STRING
  },
  accessToken: {
    type: Sequelize.STRING
  }
})

module.exports = Item
