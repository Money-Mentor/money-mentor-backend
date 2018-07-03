const Sequelize = require('sequelize');
const db = require('../db');

const LoginStreak = db.define('loginStreak', {
  userId: {
    type: Sequelize.INTEGER,
  },
  lastLogin: {
    type: Sequelize.DATE,
  },
});

module.exports = LoginStreak;
