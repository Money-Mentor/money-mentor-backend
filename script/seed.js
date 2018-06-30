'use strict';

const db = require('../server/db');
const { User, Transaction, Account, Item } = require('../server/db/models');
// const allTransactions = require('./transactionSeed')

/**
 * Welcome to the seed file! This seed file uses a newer language feature called...
 *
 *                  -=-= ASYNC...AWAIT -=-=
 *
 * Async-await is a joy to use! Read more about it in the MDN docs:
 *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function
 *
 * Now that you've got the main idea, check it out in practice below!
 */

async function seed() {
  await db.sync({ force: true });
  console.log('db synced!');
  // Whoa! Because we `await` the promise that db.sync returns, the next line will not be
  // executed until that promise resolves!

  /*-------------------- USERS ----------------------*/
  const joyce = await User.create({
    email: 'joyce@email.com',
    password: '123',
    personalityType: 'Ostrich',
  });
  const sheri = await User.create({
    email: 'sheri@email.com',
    password: '123',
    personalityType: 'Cash Splasher',
  });

  /*-------------------- ITEMS ----------------------*/
  const joyceItem = await Item.create({
    bank: 'chase',
    accessToken: 'access-sandbox-123',
  });
  const sheriItem = await Item.create({
    bank: 'bank of america',
    accessToken: 'access-sandbox-456',
  });

  /*-------------------- ACCOUNTS ----------------------*/
  const joyceChaseChecking = await Account.create({
    account_id: 'joyceChaseAccount',
    current_balance: 5000,
    available_balance: 5000,
    name: 'Chase Checking',
    userId: joyce.id,
    bankId: joyceItem.id,
  });
  const joyceChaseCredit = await Account.create({
    account_id: 'joyceChaseCredit',
    current_balance: 2000,
    available_balance: 2000,
    name: 'Chase Credit Card',
    userId: joyce.id,
    bankId: joyceItem.id,
  });
  const joyceChaseSaving = await Account.create({
    account_id: 'joyceChaseSaving',
    current_balance: 10000,
    available_balance: 10000,
    name: 'Chase Saving',
    userId: joyce.id,
  });

  const sheriChaseChecking = await Account.create({
    account_id: 'sheriChaseChecking',
    current_balance: 4000,
    available_balance: 4000,
    name: 'Bank of America Checking',
    userId: sheri.id,
    bankId: sheriItem.id,
  });
  const sheriChaseCredit = await Account.create({
    account_id: 'sheriChaseCredit',
    current_balance: 3000,
    available_balance: 3000,
    name: 'Bank of America Credit Card',
    userId: sheri.id,
    bankId: sheriItem.id,
  });
  const sheriChaseSaving = await Account.create({
    account_id: 'sheriChaseSaving',
    current_balance: 12000,
    available_balance: 12000,
    name: 'Bank of America Saving',
    userId: sheri.id,
    bankId: sheriItem.id,
  });

  /*-------------------- TRANSACTIONS ---------------------*/
  // const transactions = await Promise.all(
  //   allTransactions.map(transaction => Transaction.create(transaction))
  // );

  const users = await Promise.all([
    User.create({
      email: 'cody@email.com',
      password: '123',
    }),
    User.create({ email: '1', password: '1' }),
  ]);

  const trans = await Promise.all([
    Transaction.create({
      name: 'Starbucks',
      amount: 10,
      date: '2018-6-29',
      category1: 'Food and Drink',
      category2: 'Coffee Shop',
      userId: 3,
    }),
  ]);

  // Wowzers! We can even `await` on the right-hand side of the assignment operator
  // and store the result that the promise resolves to in a variable! This is nice!
  console.log(`seeded ${users.length} users`);
  console.log(`seeded successfully`);
}

// Execute the `seed` function, IF we ran this module directly (`node seed`).
// `Async` functions always return a promise, so we can use `catch` to handle
// any errors that might occur inside of `seed`.
if (module === require.main) {
  seed()
    .catch(err => {
      console.error(err);
      process.exitCode = 1;
    })
    .finally(() => {
      // `finally` is like then + catch. It runs no matter what.
      console.log('closing db connection');
      db.close();
      console.log('db connection closed');
    });
  /*
   * note: everything outside of the async function is totally synchronous
   * The console.log below will occur before any of the logs that occur inside
   * of the async function
   */
  console.log('seeding...');
}

// we export the seed function for testing purposes (see `./seed.spec.js`)
module.exports = seed;
