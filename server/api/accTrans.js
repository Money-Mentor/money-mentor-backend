const router = require('express').Router()
const Account = require('../db/models/account');
const Transaction = require('../db/models/transaction');
const Budget = require('../db/models/budget')

module.exports = router

// api/accTrans - get all accounts and transactions from local DB
router.get('/', async (req, res, next) => {
  const user = req.user
  try {
    const accounts = await Account.findAll({
      where: {
        userId: user.id
      }
    });
    
    const trans = await Transaction.findAll({
      where: {
        userId: user.id
      }
    });
    const budget = await Budget.findOne({
      where: {
        userId: user.id
      }
    })
    console.log("this is the budget", budget)
    res.json({accounts, trans, budget})
  } catch (err) { next(err) }
})
