const Sequelize = require('sequelize')
const db = require('../db')

const Category = db.define('category', {
  category_id: {
    type: Sequelize.STRING
  },
  name: {
    type: Sequelize.STRING
  }
})

module.exports = Category
