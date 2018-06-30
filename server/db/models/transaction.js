const Sequelize = require("sequelize");
const db = require("../db");

const Transaction = db.define("transaction", {
  name: {
    type: Sequelize.STRING
  },
  amount: {
    type: Sequelize.INTEGER
  },
  date: {
    type: Sequelize.STRING
  },
  accountId: {
    type: Sequelize.STRING
  },
  category1: {
    type: Sequelize.STRING
  },
  category2: {
    type: Sequelize.STRING
  },
  included: {
    type: Sequelize.BOOLEAN,
    defaultValue: true
  }
});

module.exports = Transaction;
