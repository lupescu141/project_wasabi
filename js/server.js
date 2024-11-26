const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Database connection
const db = mysql.createConnection({
  host: "",
  user: "",
  password: "", // mySQL password
  database: "", // database name
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed: " + err.stack);
    return;
  }
  console.log("Connected to database.");
});

// Fetch user data
app.get("/api/users", (req, res) => {
  const userId = 1; // Replace with session-based user identification logic
  const sql =
    "SELECT name, surname, email, phone, password FROM users WHERE id = ?";
  db.query(sql, [userId], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result[0]);
  });
});

// Update user data
app.post("/api/users", (req, res) => {
  const { name, surname, email, phone, password } = req.body;
  const userId = 1; // Replace with session-based user identification logic
  const sql =
    "UPDATE users SET name = ?, surname = ?, email = ?, phone = ?, password = ? WHERE id = ?";
  db.query(
    sql,
    [name, surname, email, phone, password, userId],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.json({ message: "User updated successfully." });
    }
  );
});

// Register a new user
app.post("/api/users", (req, res) => {
  const { name, surname, email, phone, password } = req.body;
  const sql =
    "INSERT INTO users (name, surname, email, phone, password) VALUES (?, ?, ?, ?, ?)";

  db.query(sql, [name, surname, email, phone, password], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json({ message: "User registered successfully." });
  });
});

// Fetch employee contact information
app.get("/api/employees", (req, res) => {
  const sql = "SELECT name, title, email, phone FROM employees";

  db.query(sql, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// Start server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
