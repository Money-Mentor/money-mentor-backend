const router = require('express').Router();
const axios = require('axios');
const envvar = require('envvar');
const moment = require('moment');
const plaid = require('plaid');

const Item = require('../db/models/item');
const Account = require('../db/models/account');
const Transaction = require('../db/models/transaction');
const Budget = require('../db/models/budget');
module.exports = router;

// const APP_PORT = envvar.number('APP_PORT', 8000);
const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID;
const PLAID_SECRET = process.env.PLAID_SECRET;
const PLAID_PUBLIC_KEY = process.env.PLAID_PUBLIC_KEY;
const PLAID_ENV = envvar.string('PLAID_ENV', 'sandbox');

// We store the access_token in memory - in production, store it in a secure
// persistent data store

// Initialize the Plaid client
const plaidClient = new plaid.Client(
  PLAID_CLIENT_ID,
  PLAID_SECRET,
  PLAID_PUBLIC_KEY,
  plaid.environments[PLAID_ENV]
);

// when user opens app - should see most current trans/data & saving it into the db
// should be data in between last login & current day

router.put('/', async (req, res, next) => {
  // put/:userid  maybe req.params.userid????
  console.log('req.body', req.body);
  const item = await Item.findOne({
    where: { userId: req.user.id }
  });
  const ACCESS_TOKEN = item.accessToken;

  const user = req.user;

  let startDate = item.createdAt.toISOString().slice(0, 10);
  let endDate = moment().format('YYYY-MM-DD');
  console.log('start date', startDate);
  console.log('end date', endDate);

  try {
    await plaidClient.getTransactions(
      ACCESS_TOKEN,
      startDate,
      endDate,
      async (err, transactionRes) => {
        if (err !== null) {
          if (plaid.isPlaidError(err)) {
            // This is a Plaid error
            console.log(err.error_code + ': ' + err.error_message);
          } else {
            // This is a connection error, an Error object
            console.log(err.toString());
          }
        }

        //saving  new ACCOUNT balances to our database (creating new rows for new data so that we have a history of prev months for comparisons)
        transactionRes.accounts.map(async account => {
          await Account.create({
            account_id: account.account_id,
            current_balance: account.balances.current,
            available_balance: account.balances.available,
            itemId: item.id,
            userId: user.id,
            name: account.name
          });
        });

        //saving new TRANSACTION to our database
        transactionRes.transactions.map(async transaction => {
          await Transaction.create({
            amount: transaction.amount,
            name: transaction.name,
            date: transaction.date,
            accountId: transaction.account_id,
            userId: user.id,
            category1: transaction.category[0],
            category2: transaction.category[1]
          });
        });
      }
    );

    // Grabbing all accounts and transactions and sending it back as JSON
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

    res.json({ accounts, trans });
  } catch (err) {
    // Indicates plaid API error
    console.log('/exchange token returned an error', {
      error_type: err.error_type,
      error_code: res.statusCode,
      error_message: err.error_message,
      display_message: err.display_message,
      request_id: err.request_id,
      status_code: err.status_code
    });
    next(err);
  }
});

// when user signs up for our app - pulls 2 months data & saves to db
router.post('/plaid_exchange', async (req, res, next) => {
  let ACCESS_TOKEN = 'null';
  let ITEM_ID = null;
  const user = req.user;

  try {
    /*-----------get public token fron frontend------------------*/
    let publicToken = req.body.public_token;

    /*--------exchange public token for accesstoken and itemID-----------*/
    await plaidClient.exchangePublicToken(
      publicToken,
      async (error, tokenResponse) => {
        if (error !== null) {
          var msg = 'Could not exchange public_token!';
          console.log(msg + '\n' + error);
        }
        ACCESS_TOKEN = tokenResponse.access_token;
        ITEM_ID = tokenResponse.item_id;

        //saving  ITEM (BANK INFORMATION) to our database
        const item = await Item.create({
          accessToken: ACCESS_TOKEN,
          bank: ITEM_ID,
          userId: user.id
        });

        /*-------------get ACOUNTS & TRANSACTIONS details from the last 2 months-----------*/
        let startDate = moment()
          .subtract(60, 'days')
          .format('YYYY-MM-DD');
        let endDate = moment().format('YYYY-MM-DD');

        await plaidClient.getTransactions(
          ACCESS_TOKEN,
          startDate,
          endDate,
          async (err, transactionRes) => {
            if (err !== null) {
              if (plaid.isPlaidError(err)) {
                // This is a Plaid error
                console.log(err.error_code + ': ' + err.error_message);
              } else {
                // This is a connection error, an Error object
                console.log(err.toString());
              }
            }

            //saving  ACCOUNT to our database
            transactionRes.accounts.map(async account => {
              await Account.create({
                account_id: account.account_id,
                current_balance: account.balances.current,
                available_balance: account.balances.available,
                itemId: item.id,
                userId: user.id,
                name: account.name
              });
            });

            //saving  TRANSACTION to our database
            transactionRes.transactions.map(async transaction => {
              await Transaction.create({
                amount: transaction.amount,
                name: transaction.name,
                date: transaction.date,
                accountId: transaction.account_id,
                userId: user.id,
                category1: transaction.category[0],
                category2: transaction.category[1]
              });
            });
          }
        );
      }
    );

    // Grabbing from our database (account and transactions) and sending it back as a JSON
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

    const budget = await Budget.findAll({
      where: {
        userId: user.id
      }
    });

    res.json({ accounts, trans, budget });
  } catch (err) {
    // Indicates plaid API error
    console.log('/exchange token returned an error', {
      error_type: err.error_type,
      error_code: res.statusCode,
      error_message: err.error_message,
      display_message: err.display_message,
      request_id: err.request_id,
      status_code: err.status_code
    });
    next(err);
  }
});
