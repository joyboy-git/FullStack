const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('.')); // Serve your HTML/CSS/JS/images

const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'ecommerce_db'
});

db.connect(err => {
  if (err) throw err;
  console.log('✅ MySQL Connected!');
});

// Products API
app.get('/api/products', (req, res) => {
  db.query('SELECT * FROM products', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Register
app.post('/register', async (req, res) => {
  const { email, phone, password, lat, lng } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  db.query('INSERT INTO users (email, phone, password, latitude, longitude) VALUES (?, ?, ?, ?, ?)',
    [email, phone, hashed, lat, lng],
    (err) => {
      if (err) return res.status(400).json({ error: 'User exists' });
      res.json({ message: 'Registered successfully!' });
    });
});

// Login
app.post('/login', async (req, res) => {
  const { email, password, lat, lng } = req.body;
  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (!results.length || !(await bcrypt.compare(password, results[0].password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    db.query('UPDATE users SET latitude=?, longitude=? WHERE id=?', [lat, lng, results[0].id]);
    const token = jwt.sign({ userId: results[0].id }, process.env.JWT_SECRET || 'secret');
    res.json({ token, userId: results[0].id });
  });
});

// Auth middleware
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Invalid token' });
    req.userId = decoded.userId;
    next();
  });
};

// Cart APIs
app.get('/api/cart', auth, (req, res) => {
  db.query(`
    SELECT c.*, p.name, p.price, p.image, p.specs 
    FROM carts c JOIN products p ON c.product_id = p.id 
    WHERE user_id = ?
  `, [req.userId], (err, results) => {
    res.json(results);
  });
});

app.post('/api/cart', auth, (req, res) => {
  const { product_id, quantity } = req.body;
  db.query(`
    INSERT INTO carts (user_id, product_id, quantity) 
    VALUES (?, ?, ?) 
    ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)
  `, [req.userId, product_id, quantity], (err) => {
    res.json({ message: 'Cart updated' });
  });
});

app.delete('/api/cart/:id', auth, (req, res) => {
  db.query('DELETE FROM carts WHERE id = ? AND user_id = ?', 
    [req.params.id, req.userId], (err) => {
      res.json({ message: 'Item removed' });
    });
});

app.listen(3000, () => {
  console.log('🚀 Server running on http://localhost:3000');
});
