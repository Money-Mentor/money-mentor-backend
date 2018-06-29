const july = '2018-07-';
const june = '2018-06-';
const may = '2018-05-';

const dateArr = [
  '1',
  '4',
  '5',
  '6',
  '8',
  '10',
  '11',
  '12',
  '16',
  '18',
  '20',
  '25',
  '28',
  '30',
];

const mayDateArr = dateArr.map(day => may + day);
const JuneDateArr = dateArr.map(day => june + day);

const allTransactions = [
  {
    name: 'Gregorys Coffee',
    amount: 5,
    date: '2018-06-29',
    accountId: joyceChaseCredit.account_id,
    category: 'Food and Drink',
    category2: 'Coffee Shop',
    userId: joyce.id,
  },
  {
    name: 'Gregorys Coffee',
    amount: 5,
    date: '2018-06-28',
    accountId: joyceChaseCredit.account_id,
    category: 'Food and Drink',
    category2: 'Coffee Shop',
    userId: joyce.id,
  },
  {
    name: 'Gregorys Coffee',
    amount: 5,
    date: '2018-06-27',
    accountId: joyceChaseCredit.account_id,
    category: 'Food and Drink',
    category2: 'Coffee Shop',
    userId: joyce.id,
  },
  {
    name: 'Gregorys Coffee',
    amount: 5,
    date: '2018-06-25',
    accountId: joyceChaseCredit.account_id,
    category: 'Food and Drink',
    category2: 'Coffee Shop',
    userId: joyce.id,
  },
  {
    name: 'Gregorys Coffee',
    amount: 5,
    date: '2018-06-25',
    accountId: joyceChaseCredit.account_id,
    category: 'Food and Drink',
    category2: 'Coffee Shop',
    userId: joyce.id,
  },
];

module.exports = allTransactions;
