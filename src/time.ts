const timestamp = Date.now();
const date: Date = new Date(timestamp);

const year = date.getFullYear();
const month = date.getMonth() + 1;
const day = date.getDate();

const hours = date.getHours().toString().padStart(2, '0');
const minutes = date.getMinutes().toString().padStart(2, '0');
const seconds = date.getSeconds().toString().padStart(2, '0');

const formatedDate = `${day}/${month}/${year}`;
const formatedTime = `${hours}:${minutes}:${seconds}`;
export { formatedDate, formatedTime } ;