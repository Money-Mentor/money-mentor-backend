const path = require('path');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const compression = require('compression');
const session = require('express-session');
const passport = require('passport');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const db = require('./db');
const sessionStore = new SequelizeStore({ db });
const PORT = process.env.PORT || 8080;
const app = express();

// for push notification
const moment = require('moment');
const { findOstrich } = require('./userlookUp');
const Expo = require('expo-server-sdk');
let expo = new Expo();

module.exports = app;

/**
 * In your development environment, you can keep all of your
 * app's secret API keys in a file called `secrets.js`, in your project
 * root. This file is included in the .gitignore - it will NOT be tracked
 * or show up on Github. On your production server, you can add these
 * keys as environment variables, so that they can still be read by the
 * Node process on process.env
 */
if (process.env.NODE_ENV !== 'production') require('../secrets');

// passport registration
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) =>
  db.models.user
    .findById(id)
    .then(user => done(null, user))
    .catch(done)
);

const createApp = () => {
  // logging middleware
  app.use(morgan('dev'));

  // body parsing middleware
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  // compression middleware
  app.use(compression());

  // session middleware with passport
  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'my best friend is Cody',
      store: sessionStore,
      resave: false,
      saveUninitialized: false,
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());

  // auth and api routes
  app.use('/auth', require('./auth'));
  app.use('/api', require('./api'));

  // any remaining requests with an extension (.js, .css, etc.) send 404
  app.use((req, res, next) => {
    if (path.extname(req.path).length) {
      const err = new Error('Not found');
      err.status = 404;
      next(err);
    } else {
      next();
    }
  });

  // error handling endware
  app.use((err, req, res, next) => {
    console.error(err);
    console.error(err.stack);
    res.status(err.status || 500).send(err.message || 'Internal server error.');
  });
};

const startListening = () => {
  // start listening (and create a 'server' object representing our server)
  const server = app.listen(PORT, () =>
    console.log(`Mixing it up on port ${PORT}`)
  );
};

const syncDb = () => db.sync();

// ------------------- setInterval for sending pushNotificaitons ----------------------
// let interval = 5000; //   need to use interval that user sets

// setInterval(function() {
//   let messages = [];

//   (async () => {
//     let ostrichArr = await findOstrich();

//     for (let i = 0; i < ostrichArr.length; i++) {
//       // check whether pushToken is valid
//       if (!Expo.isExpoPushToken(ostrichArr[i].pushToken)) {
//         console.error(
//           `Push token ${ostrichArr[i].pushToken} is not a valid Expo push token`
//         );
//         continue;
//       }

//       // check if notification needs to be sent based on lastLogin & interval
//       let userLastLogin = ostrichArr[i].lastLogin;
//       // let userLastLoginDate = userLastLogin.toISOString().slice(0, 10);
//       let currentDate = moment().toDate()//.format('YYYY-MM-DD');
//       let difference = currentDate - userLastLogin

//       console.log('userLastLogin', userLastLogin)
//       // console.log('userLastLoginDate', userLastLoginDate)
//       console.log('currentDate', currentDate)
//       console.log('difference', difference);

//       if (difference > interval) {
//         // construct message
//         messages.push({
//           to: ostrichArr[i].pushToken,
//           sound: 'default',
//           body: 'This is a test notification',
//           data: { withSome: 'data' },
//         });
//       }

//       // batch up notifications to reduce number of requests
//       let chunks = expo.chunkPushNotifications(messages);
//       console.log('chunks==================', chunks);

//       for (let chunk of chunks) {
//         try {
//           let receipts = await expo.sendPushNotificationsAsync(chunk);
//           console.log(receipts);
//         } catch (error) {
//           console.error(error);
//         }
//       }
//     }
//   })();
// }, interval);

// This evaluates as true when this file is run directly from the command line,
// i.e. when we say 'node server/index.js' (or 'nodemon server/index.js', or 'nodemon server', etc)
// It will evaluate false when this module is required by another module - for example,
// if we wanted to require our app in a test spec
if (require.main === module) {
  sessionStore
    .sync()
    .then(syncDb)
    .then(createApp)
    .then(startListening);
} else {
  createApp();
}
