const Sequelize = require('sequelize');
const db = require('../db');

const Budget = db.define('budget', {
  income: {
    type: Sequelize.INTEGER
  },
  rent: {
    type: Sequelize.INTEGER
  },
  savings: {
    type: Sequelize.INTEGER
  },
  spendingBudget: {
    type: Sequelize.INTEGER
  }
});

module.exports = Budget;
