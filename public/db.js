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


request.onerror = (event) => {
    console.log("Whoops, something's gone wrong! " + event.target.errorCode);
};

function saveRecord(record) {
    // create a transaction on the pending db with readwrite access
    const transaction = db.transaction(["pending"], "readwrite");

    // this accesses what is already pending for your object store
    const store = transaction.objectStore("pending");

    // this adds the record to your store
    store.add(record);
}

function checkDatabase() {
    // this opens a transaction for your pending database
    const transaction = db.transaction(["pending"], "readwrite");
    // this accesses the items in your pending object store
    const store = transaction.objectStore("pending");
    // this gets all records from the store and sets to the variable
    const getAll = store.getAll();
  
    getAll.onsuccess = function () {
      if (getAll.result.length > 0) {
        fetch("/api/transaction/bulk", {
          method: "POST",
          body: JSON.stringify(getAll.result),
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json"
          }
        })
          .then(response => response.json())
          .then(() => {
            // if this is successful it will open a transaction for your pending db
            const transaction = db.transaction(["pending"], "readwrite");
  
            // this will access your pending object store
            const store = transaction.objectStore("pending");
  
            // below clears all items in your store
            store.clear();
          });
      }
    };
  }
  
// This listens for when the app comes back online
window.addEventListener("online", checkDatabase);