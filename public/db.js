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
