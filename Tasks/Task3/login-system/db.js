const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "logindb"
});

db.connect((err) => {
    if (err) {
        console.log("DB connection failed");
    } else {
        console.log("Connected to MySQL");
    }
});

module.exports = db;