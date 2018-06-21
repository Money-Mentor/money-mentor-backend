const User = require('./user');
const Account = require('./account');
const Category = require('./category');
const Item = require('./item');
const Transaction = require('./transaction');
/**
 * If we had any associations to make, this would be a great place to put them!
 * ex. if we had another model called BlogPost, we might say:
 *
 *    BlogPost.belongsTo(User)
 */
User.hasMany(Item);
Item.belongsTo(User);

User.hasMany(Account);
Account.belongsTo(User);

Item.hasMany(Account);
Account.belongsTo(Item);

Transaction.belongsToMany(Category, { through: 'transactionCategory' });
Category.belongsToMany(Transaction, { through: 'transactionCategory' });

User.hasMany(Transaction);
Transaction.belongsTo(User);

/**
 * We'll export all of our models here, so that any time a module needs a model,
 * we can just require it from 'db/models'
 * for example, we can say: const {User} = require('../db/models')
 * instead of: const User = require('../db/models/user')
 */
module.exports = {
  User,
  Account,
  Category,
  Item,
  Transaction,
};
