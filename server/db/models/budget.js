const Sequelize = require('sequelize');
const db = require('../db');

const Budget = db.define('budget', {
  income: {
    type: Sequelize.INTEGER
  },
  staticCosts: {
    type: Sequelize.INTEGER
  },
  savings: {
    type: Sequelize.INTEGER
  },
  spendingBudget: {
    type: Sequelize.INTEGER
  },
  foodAndDrink: {
    type: Sequelize.INTEGER,
    defaultValue: 35
  },
  travel: {
    type: Sequelize.INTEGER,
    defaultValue: 10
  },
  recreation: {
    type: Sequelize.INTEGER,
    defaultValue: 15
  },
  healthcare: {
    type: Sequelize.INTEGER,
    defaultValue: 10
  },
  service: {
    type: Sequelize.INTEGER,
    defaultValue: 10
  },
  community: {
    type: Sequelize.INTEGER,
    defaultValue: 10
  },
  shops: {
    type: Sequelize.INTEGER,
    defaultValue: 10
  },
});

module.exports = Budget;
