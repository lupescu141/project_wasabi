const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Database connection
const db = mysql.createConnection({
  host: "", // your database host
  user: "", // your database username
  password: "", // your database password
  database: "", // your database name
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
app.post("/api/users/register", (req, res) => {
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

// Fetch all orders
app.get("/api/orders", (req, res) => {
  const sql = `
    SELECT 
      orders.id AS number,
      orders.time,
      orders.status AS progress,
      GROUP_CONCAT(products.name SEPARATOR ', ') AS products,
      SUM(order_products.quantity * products.price) AS total_price
    FROM 
      orders
    JOIN 
      order_products ON orders.id = order_products.order_id
    JOIN 
      products ON order_products.product_id = products.id
    GROUP BY 
      orders.id;
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// Update order details
app.put("/api/orders/:id", (req, res) => {
  const orderId = req.params.id;
  const { progress } = req.body;

  const sql = "UPDATE orders SET status = ? WHERE id = ?";
  db.query(sql, [progress, orderId], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json({ message: "Order updated successfully." });
  });
});

// Endpoint to verify user login
app.post("/api/users/login", (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
  db.query(sql, [email, password], (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.length > 0) {
      // User found, send success
      res.json({ success: true });
    } else {
      // User not found, send error
      res.json({ success: false });
    }
  });
});

// Start server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
