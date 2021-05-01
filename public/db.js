let db;
// create request for new database for the budget
const request = indexedDB.open("budget", 1);

request.onupgradeneeded = (event) => {
  // this creates an object store called pending and it will auto increment
  const db = event.target.result;
  db.createObjectStore("pending", { autoIncrement: true });
};

request.onsuccess = (event) => {
    db = event.target.result;
  
    // this will check if the app is online before it reads from the database
    if (navigator.onLine) {
      checkDatabase();
    }
  };