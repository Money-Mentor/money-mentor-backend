const router = require('express').Router();
const { User, Budget } = require('../db/models');
module.exports = router;

router.get('/', async (req, res, next) => {
  User.findAll({
    // explicitly select only the id and email fields - even though
    // users' passwords are encrypted, it won't help if we just
    // send everything to anyone who asks!
    attributes: ['id', 'email']
  })
    .then(users => res.json(users))
    .catch(next);
});

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

// Route to save down PushToken
router.put('/:id', async (req, res, next) => {
  try {
    // const user = req.user;
    let user = await User.findById(req.params.id);
    if (!user) {
      res.sendStatus(404);
    }
    const pushToken = req.body.user.pushToken;
    user.update({
      pushToken: pushToken
    });
    res.json(user);
  } catch (err) {
    next(err);
  }
});
