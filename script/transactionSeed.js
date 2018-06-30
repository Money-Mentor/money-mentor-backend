const numDates = 30;
const dateArr = doTimes(numDates);

function randomDate(start, end) {
  var d = new Date(
      start.getTime() + Math.random() * (end.getTime() - start.getTime())
    ),
    month = '' + (d.getMonth() + 1),
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

function randomAmount() {
  return Math.floor(Math.random() * 30) + 10;
}
function randomAmountSmall() {
  return Math.floor(Math.random() * 5) + 5;
}

const joyce = [
  ...dateArr.map(day => {
    return {
      name: 'Gregorys Coffee',
      amount: randomAmountSmall(),
      date: day,
      accountId: joyceChaseCredit.account_id,
      category: 'Food and Drink',
      category2: 'Coffee Shop',
      userId: joyce.id,
    };
  }),
  ...dateArr.map(day => {
    return {
      name: 'Open Kitchen',
      amount: randomAmountSmall(),
      date: day,
      accountId: joyceChaseCredit.account_id,
      category: 'Food and Drink',
      category2: 'Restaurants',
      userId: joyce.id,
    };
  }),
  ...dateArr.map(day => {
    return {
      name: `Trader Joe's`,
      amount: randomAmount(),
      date: day,
      accountId: joyceChaseCredit.account_id,
      category: 'Shops',
      category2: 'Supermarkets and Groceries',
      userId: joyce.id,
    };
  }),
  ...dateArr.map(day => {
    return {
      name: `Killarney Rose`,
      amount: randomAmount(),
      date: day,
      accountId: joyceChaseCredit.account_id,
      category: 'Shops',
      category2: 'Supermarkets and Groceries',
      userId: joyce.id,
    };
  }),
  ...dateArr.map(day => {
    return {
      name: `Amazon`,
      amount: randomAmount(),
      date: day,
      accountId: joyceChaseCredit.account_id,
      category: 'Shops',
      category2: 'Supermarkets and Groceries',
      userId: joyce.id,
    };
  }),
];
