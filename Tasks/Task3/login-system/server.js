const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.post("/login", (req, res) => {
    const { username, password } = req.body;

    const sql = "SELECT * FROM users WHERE username=? AND password=?";
    
    db.query(sql, [username, password], (err, result) => {
        if (err) {
            return res.json({ success: false, message: "Server error" });
        }

        if (result.length > 0) {
            res.json({ success: true, message: "Login successful" });
        } else {
            res.json({ success: false, message: "Invalid credentials" });
        }
    });
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});