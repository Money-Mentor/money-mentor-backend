const router = require('express').Router();
const { User, Budget } = require('../db/models');
module.exports = router;

// /api/budget/:userId
router.put('/:id', async (req, res, next) => {
  try {
    const budget = await Budget.findOne({
      where: {
        userId: req.params.id
      }
    });
    if (!budget) res.sendStatus(404);
    const updatedBudget = await budget.update(req.body);
    res.json(updatedBudget);
  } catch (err) {
    next(err);
  }
});
