const router = require('express').Router();
const { User, Budget } = require('../db/models');
module.exports = router;

// PUT: /api/budget - update budget
router.put('/', async (req, res, next) => {
  try {
    const user = req.user;
    const budget = await Budget.findOne({
      where: {
        userId: user.id
      }
    });
    if (!budget) res.sendStatus(404);
    const updatedBudget = await budget.update(req.body);
    res.json(updatedBudget);
  } catch (err) {
    next(err);
  }
});

// GET: /api/budget - retrieve budget
router.get('/:id', async (req, res, next) => {
  try {
    const userId = req.params.id;
    const budget = await Budget.findOne({
      where: {
        userId: userId
      }
    });
    if (!budget) res.sendStatus(404);
    res.json(budget);
  } catch (err) {
    next(err);
  }
});
