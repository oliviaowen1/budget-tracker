let db;
// create request for new database for the budget
const request = indexedDB.open("budget", 1);

request.onupgradeneeded = function (event) {
  // this creates an object store called pending and it will auto increment
  const db = event.target.result;
  db.createObjectStore("pending", { autoIncrement: true });
};