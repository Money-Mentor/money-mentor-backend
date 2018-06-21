const Sequelize = require('sequelize');
const db = require('../db');

const Account = db.define('account', {
  account_id: {
    type: Sequelize.STRING,
  },
  // This will be balances.current in Plaid's response
  current_balance: {
    type: Sequelize.INTEGER,
  },
  available_balance: {
    type: Sequelize.INTEGER,
  },
  name: {
    type: Sequelize.STRING,
  }
});

module.exports = Account;
