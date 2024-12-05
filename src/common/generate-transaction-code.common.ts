import moment from 'moment';

export function generateTransactionCode() {
  const date = moment().tz('UTC').add(7, 'hours');
  //const year = date.year();
  const month = date.month() + 1;
  const day = date.date();

  const dateString = `${day}${month}`;

  const randomCode = `${randomString(8)}`;

  const transactionCode = `${randomCode}${dateString}`;

  return transactionCode;
}

function randomString(length: number) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from({ length }, () => characters[Math.floor(Math.random() * characters.length)]).join('');
}
