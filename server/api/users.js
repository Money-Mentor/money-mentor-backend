const router = require('express').Router();
const { User, Budget } = require('../db/models');
module.exports = router;


router.put('/:id', async (req, res, next) => {
  try {
    // const user = req.user;
    let user = await User.findById(req.params.id);
    if (!user) {
      res.sendStatus(404);
    }
    const newType = req.body.user.personalityType;
    user.update({
      personalityType: newType
    });
    res.json(user);
  } catch (err) {
    next(err);
  }
});

