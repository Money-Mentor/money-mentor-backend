const router = require('express').Router();
const User = require('../db/models/user');
const Budget = require('../db/models/budget');
module.exports = router;

router.post('/login', (req, res, next) => {
  // EXPECT req.body TO ALSO HAVE pushToken
  // console.log('PUSH TOKEN ===============================', req.body);

  User.findOne({ where: { email: req.body.email } })
    .then(user => {
      if (!user) {
        console.log('No such user found:', req.body.email);
        res.status(401).send('Wrong username and/or password');
      } else if (!user.correctPassword(req.body.password)) {
        console.log('Incorrect password for user:', req.body.email);
        res.status(401).send('Wrong username and/or password');
      } else {
        // SUCCESS!  USER IS CORRECT
        // user.update({ pushToken: req.body.pushToken }); // now it's in the DB
        req.login(user, err => (err ? next(err) : res.json(user)));
      }
    })
    .catch(next);
});

router.post('/signup', async (req, res, next) => {
  try {
    let user = await User.create(req.body);
    user.budget = await user.createBudget();
    req.login(user, err => (err ? next(err) : res.json(user)));
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      res.status(401).send('User already exists');
    } else {
      next(err);
    }
  }
});

router.post('/logout', (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect('/');
});

router.get('/me', (req, res) => {
  res.json(req.user);
});

router.use('/google', require('./google'));
