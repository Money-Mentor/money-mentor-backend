'use strict';

const db = require('../server/db');
const {
  User,
  Transaction,
  Account,
  Item,
  Budget,
  LoginStreak,
} = require('../server/db/models');

const loginDateArr = doTimes(60).map(date => new Date(date));
const payday = [
  '2018-05-11',
  '2018-05-25',
  '2018-06-08',
  '2018-06-22',
  '2018-07-06',
];
const onceAMonth = ['2018-05-01', '2018-06-01', '2018-07-01'];

const coffeeShop = [
  'Starbucks',
  'Gregorys Coffee',
  'Bluestone Lane',
  'Joe and the Juice',
  'La Colombe Coffee Roasters',
];
const restaurant = [
  'Sweet Green',
  'Open Market',
  'Dig In',
  'Go Go Curry',
  `Chop't`,
  'Oaxaca Taqueria',
];
const grocery = [
  'Whole Foods',
  `Trader Joe's`,
  'Westside Market',
  '55 Fulton Market',
];
const shops = [
  'Zara',
  `Reformation`,
  'Express',
  'Club Monaco',
  'Gap',
  `Macy's`,
  'Aldo',
  'Zee DOG',
  'Artizia',
  'REI',
];

const taxi = ['Yellow Cab', 'Uber', 'Lyft', 'Juno'];

function randomStore(category) {
  return category[Math.floor(Math.random() * category.length)];
}

function randomDate(start, end) {
  var d = new Date(
      start.getTime() + Math.random() * 2 * (end.getTime() - start.getTime())
    ),
    month = '' + d.getMonth(),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
}

function doTimes(n) {
  const results = [];
  while (n--) {
    results.push(randomDate(new Date(2018, 5, 1), new Date()));
  }
  return results;
}

function randomBigAmount() {
  return Math.floor(Math.random() * 40) + 30;
}

function randomAmount() {
  return Math.floor(Math.random() * 30) + 10;
}
function randomAmountSmall() {
  return Math.floor(Math.random() * 5) + 5;
}

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
    streakType: 'Login',
  });
  const sheri = await User.create({
    email: 'sheri@email.com',
    password: '123',
    personalityType: 'Cash Splasher',
    streakType: 'Clothing',
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

  /*-------------------- Login ----------------------*/
  const loginData = [
    ...loginDateArr.map(day => {
      return {
        lastLogin: day,
        userId: joyce.id,
      };
    }),
    ...loginDateArr.map(day => {
      return {
        lastLogin: day,
        userId: sheri.id,
      };
    }),
  ];

  await Promise.all(loginData.map(login => LoginStreak.create(login)));

  /*-------------------- BUDGET ----------------------*/
  const budget = await Promise.all([
    Budget.create({
      income: 5000,
      staticCosts: 1600,
      savings: 1000,
      spendingBudget: 5000 - 1600 - 1000,
      userId: joyce.id,
    }),
    Budget.create({
      income: 5500,
      staticCosts: 1600,
      savings: 1000,
      spendingBudget: 5500 - 1600 - 1000,
      userId: sheri.id,
    }),
  ]);

  /*-------------------- ACCOUNTS ----------------------*/
  const joyceChecking = await Account.create({
    account_id: 'joyceChaseAccount',
    current_balance: 5000,
    available_balance: 5000,
    name: 'Chase Checking',
    userId: joyce.id,
    bankId: joyceItem.id,
  });
  const joyceCredit = await Account.create({
    account_id: 'joyceChaseCredit',
    current_balance: 2000,
    available_balance: 2000,
    name: 'Chase Credit Card',
    userId: joyce.id,
    bankId: joyceItem.id,
  });
  const joyceSaving = await Account.create({
    account_id: 'joyceChaseSaving',
    current_balance: 10000,
    available_balance: 10000,
    name: 'Chase Saving',
    userId: joyce.id,
  });

  const sheriChecking = await Account.create({
    account_id: 'sheriChaseChecking',
    current_balance: 4000,
    available_balance: 4000,
    name: 'Bank of America Checking',
    userId: sheri.id,
    bankId: sheriItem.id,
  });
  const sheriCredit = await Account.create({
    account_id: 'sheriChaseCredit',
    current_balance: 3000,
    available_balance: 3000,
    name: 'Bank of America Credit Card',
    userId: sheri.id,
    bankId: sheriItem.id,
  });
  const sheriSaving = await Account.create({
    account_id: 'sheriChaseSaving',
    current_balance: 12000,
    available_balance: 12000,
    name: 'Bank of America Saving',
    userId: sheri.id,
    bankId: sheriItem.id,
  });

  /*-------------------- TRANSACTIONS ---------------------*/
  const allTransactions = [
    ...payday.map(day => {
      return {
        name: 'Google Payroll',
        amount: -2200,
        date: day,
        accountId: joyceChecking.account_id,
        category1: 'Transfer',
        category2: 'Payroll',
        userId: joyce.id,
      };
    }),
    ...payday.map(day => {
      return {
        name: 'Google Payroll',
        amount: -500,
        date: day,
        accountId: joyceSaving.account_id,
        category1: 'Transfer',
        category2: 'Payroll',
        userId: joyce.id,
      };
    }),
    ...onceAMonth.map(day => {
      return {
        name: 'Credit Card Payment',
        amount: 200,
        date: day,
        accountId: joyceChecking.account_id,
        category1: 'Payment',
        category2: 'Credit Card',
        userId: joyce.id,
      };
    }),
    ...onceAMonth.map(day => {
      return {
        name: 'Rent',
        amount: 1500,
        date: day,
        accountId: joyceChecking.account_id,
        category1: 'Payment',
        category2: 'Rent',
        userId: joyce.id,
      };
    }),
    ...onceAMonth.map(day => {
      return {
        name: 'ConEd',
        amount: 50,
        date: day,
        accountId: joyceChecking.account_id,
        category1: 'Payment',
        category2: 'Electric Bill',
        userId: joyce.id,
      };
    }),
    ...doTimes(30).map(day => {
      return {
        name: randomStore(coffeeShop),
        amount: randomAmountSmall(),
        date: day,
        accountId: joyceCredit.account_id,
        category1: 'Food and Drink',
        category2: 'Coffee Shop',
        userId: joyce.id,
      };
    }),
    ...doTimes(30).map(day => {
      return {
        name: randomStore(restaurant),
        amount: randomAmountSmall(),
        date: day,
        accountId: joyceCredit.account_id,
        category1: 'Food and Drink',
        category2: 'Restaurants',
        userId: joyce.id,
      };
    }),
    ...doTimes(30).map(day => {
      return {
        name: randomStore(grocery),
        amount: randomAmount(),
        date: day,
        accountId: joyceCredit.account_id,
        category1: 'Shops',
        category2: 'Supermarkets and Groceries',
        userId: joyce.id,
      };
    }),
    ...doTimes(30).map(day => {
      return {
        name: `Killarney Rose`,
        amount: randomAmount(),
        date: day,
        accountId: joyceCredit.account_id,
        category1: 'Food and Drink',
        category2: 'Bar',
        userId: joyce.id,
      };
    }),
    ...doTimes(30).map(day => {
      return {
        name: `Amazon`,
        amount: randomAmount(),
        date: day,
        accountId: joyceCredit.account_id,
        category1: 'Shops',
        category2: 'Department Stores',
        userId: joyce.id,
      };
    }),
    ...doTimes(15).map(day => {
      return {
        name: randomStore(taxi),
        amount: randomAmount(),
        date: day,
        accountId: joyceCredit.account_id,
        category1: 'Travel',
        category2: 'Car Service',
        userId: joyce.id,
      };
    }),
    ...doTimes(15).map(day => {
      return {
        name: randomStore(shops),
        amount: randomBigAmount(),
        date: day,
        accountId: joyceCredit.account_id,
        category1: 'Shops',
        category2: 'Clothing',
        userId: joyce.id,
      };
    }),
    {
      name: 'Madison Bicycle Shop',
      amount: 50,
      date: '2018-06-12',
      accountId: joyceCredit.account_id,
      category1: 'Shops',
      category2: 'Bicycles',
      userId: joyce.id,
    },
    {
      name: 'United Airlines',
      amount: 350,
      date: '2018-06-19',
      accountId: joyceCredit.account_id,
      category1: 'Travel',
      category2: 'Airlines and Aviation Services',
      userId: joyce.id,
    },
    ...onceAMonth.map(day => {
      return {
        name: 'Netflix',
        amount: 12,
        date: day,
        accountId: joyceCredit.account_id,
        category1: 'Service',
        category2: 'Entertainment',
        userId: joyce.id,
      };
    }),
    ...onceAMonth.map(day => {
      return {
        name: 'Touchstone CLimbing',
        amount: 79,
        date: day,
        accountId: joyceCredit.account_id,
        category1: 'Recreation',
        category2: 'Gyms and Fitness Centers',
        userId: joyce.id,
      };
    }),
    /*----------- SHERI SEED FILE-----------------*/
    ...payday.map(day => {
      return {
        name: 'Facebook Payroll',
        amount: -2200,
        date: day,
        accountId: sheriChecking.account_id,
        category1: 'Transfer',
        category2: 'Payroll',
        userId: sheri.id,
      };
    }),
    ...payday.map(day => {
      return {
        name: 'FacebookPayroll',
        amount: -500,
        date: day,
        accountId: sheriSaving.account_id,
        category1: 'Transfer',
        category2: 'Payroll',
        userId: sheri.id,
      };
    }),
    ...onceAMonth.map(day => {
      return {
        name: 'Credit Card Payment',
        amount: 200,
        date: day,
        accountId: sheriChecking.account_id,
        category1: 'Payment',
        category2: 'Credit Card',
        userId: sheri.id,
      };
    }),
    ...onceAMonth.map(day => {
      return {
        name: 'Rent',
        amount: 1500,
        date: day,
        accountId: sheriChecking.account_id,
        category1: 'Payment',
        category2: 'Rent',
        userId: sheri.id,
      };
    }),
    ...onceAMonth.map(day => {
      return {
        name: 'ConEd',
        amount: 50,
        date: day,
        accountId: sheriChecking.account_id,
        category1: 'Payment',
        category2: 'Electric Bill',
        userId: sheri.id,
      };
    }),
    ...doTimes(30).map(day => {
      return {
        name: randomStore(coffeeShop),
        amount: randomAmountSmall(),
        date: day,
        accountId: sheriCredit.account_id,
        category1: 'Food and Drink',
        category2: 'Coffee Shop',
        userId: sheri.id,
      };
    }),
    ...doTimes(30).map(day => {
      return {
        name: randomStore(restaurant),
        amount: randomAmountSmall(),
        date: day,
        accountId: sheriCredit.account_id,
        category1: 'Food and Drink',
        category2: 'Restaurants',
        userId: sheri.id,
      };
    }),
    ...doTimes(30).map(day => {
      return {
        name: randomStore(grocery),
        amount: randomAmount(),
        date: day,
        accountId: sheriCredit.account_id,
        category1: 'Shops',
        category2: 'Supermarkets and Groceries',
        userId: sheri.id,
      };
    }),
    ...doTimes(30).map(day => {
      return {
        name: `Killarney Rose`,
        amount: randomAmount(),
        date: day,
        accountId: sheriCredit.account_id,
        category1: 'Food and Drink',
        category2: 'Bar',
        userId: sheri.id,
      };
    }),
    ...doTimes(30).map(day => {
      return {
        name: `Amazon`,
        amount: randomAmount(),
        date: day,
        accountId: joyceCredit.account_id,
        category1: 'Shops',
        category2: 'Department Stores',
        userId: joyce.id,
      };
    }),
    ...doTimes(10).map(day => {
      return {
        name: randomStore(taxi),
        amount: randomAmount(),
        date: day,
        accountId: sheriCredit.account_id,
        category1: 'Travel',
        category2: 'Car Service',
        userId: sheri.id,
      };
    }),
    ...doTimes(10).map(day => {
      return {
        name: randomStore(shops),
        amount: randomBigAmount(),
        date: day,
        accountId: sheriCredit.account_id,
        category1: 'Shops',
        category2: 'Clothing',
        userId: sheri.id,
      };
    }),
    {
      name: 'Madison Bicycle Shop',
      amount: 50,
      date: '2018-06-12',
      accountId: sheriCredit.account_id,
      category1: 'Shops',
      category2: 'Bicycles',
      userId: sheri.id,
    },
    {
      name: 'United Airlines',
      amount: 350,
      date: '2018-06-19',
      accountId: sheriCredit.account_id,
      category1: 'Travel',
      category2: 'Airlines and Aviation Services',
      userId: sheri.id,
    },
    ...onceAMonth.map(day => {
      return {
        name: 'Netflix',
        amount: 12,
        date: day,
        accountId: sheriCredit.account_id,
        category1: 'Service',
        category2: 'Entertainment',
        userId: sheri.id,
      };
    }),
    ...onceAMonth.map(day => {
      return {
        name: 'Touchstone CLimbing',
        amount: 79,
        date: day,
        accountId: sheriCredit.account_id,
        category1: 'Recreation',
        category2: 'Gyms and Fitness Centers',
        userId: sheri.id,
      };
    }),
  ];

  const transactions = await Promise.all(
    allTransactions.map(transaction => Transaction.create(transaction))
  );

  // Wowzers! We can even `await` on the right-hand side of the assignment operator
  // and store the result that the promise resolves to in a variable! This is nice!
  console.log(`seeded ${transactions.length} users`);
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
