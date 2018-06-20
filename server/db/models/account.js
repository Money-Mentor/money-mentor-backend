const Sequelize = require('sequelize')
const db = require('../db')

const Account = db.define('account', {
  account_id: {
    type: Sequelize.STRING
  },
  // This will be balances.current in Plaid's response
  balance: {
    type: Sequelize.INTEGER
  }
})

module.exports = Account
