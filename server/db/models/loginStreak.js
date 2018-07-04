const Sequelize = require('sequelize');
const db = require('../db');

const LoginStreak = db.define('loginStreak', {
  lastLogin: {
    type: Sequelize.DATE,
  },
});

module.exports = LoginStreak;
