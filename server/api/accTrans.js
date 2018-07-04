const router = require('express').Router();
const Account = require('../db/models/account');
const Transaction = require('../db/models/transaction');
const Budget = require('../db/models/budget');
const LoginStreak = require('../db/models/loginStreak');

module.exports = router;

// api/accTrans - get all accounts and transactions from local DB
router.get('/', async (req, res, next) => {
  const user = req.user;
  try {
    const accounts = await Account.findAll({
      where: {
        userId: user.id,
      },
    });

    const trans = await Transaction.findAll({
      where: {
        userId: user.id,
      },
    });
    const budget = await Budget.findOne({
      where: {
        userId: user.id,
      },
    });
    const loginStreak = await LoginStreak.findAll({
      where: {
        userId: user.id,
      },
    });
    res.json({ accounts, trans, budget, loginStreak });
  } catch (err) {
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  const id = req.params.id;

  try {
    const transaction = await Transaction.findById(id);
    const newTransaction = await transaction.update({
      included: req.body.included,
      category1: req.body.category1,
    });
    res.json(newTransaction);
  } catch (error) {
    next(error);
  }
});
