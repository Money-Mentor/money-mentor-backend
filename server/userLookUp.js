const { User } = require('./db/models');

async function findOstrich() {
  let ostrichArr = await User.findAll({
    where: {
      personalityType: 'Ostrich',
    },
  });
  return ostrichArr;
}

module.exports = { findOstrich };
