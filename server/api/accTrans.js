const router = require('express').Router()
const Account = require('../db/models/account');
const Transaction = require('../db/models/transaction');

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
    console.log("what is res.json", accounts, trans)
    res.json({accounts, trans})
  } catch (err) { next(err) }
})
