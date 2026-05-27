const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "studentdb"
});

// Connect database
db.connect((err) => {
    if (err) {
        console.log("Database connection failed:", err);
    } else {
        console.log("Connected to MySQL Database");
    }
});

// Test route
app.get("/", (req, res) => {
    res.send("Server is running successfully");
});

// Register API
app.post("/register", (req, res) => {

    const { username, email, dob, phone, department } = req.body;

    const sql = "INSERT INTO users (username,email,dob,phone,department) VALUES (?,?,?,?,?)";

    db.query(sql, [username, email, dob, phone, department], (err, result) => {

        if (err) {
            console.log(err);
            res.send("Database error");
        } else {
            res.send("Registration successful!");
        }

    });

});

// Start server
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});