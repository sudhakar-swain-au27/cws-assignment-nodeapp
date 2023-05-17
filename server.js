const express = require('express');
const multer = require('multer');
const mysql = require('mysql');

const app = express();
const port = 3000;

// Database configuration
const db = mysql.createConnection({
  host: 'localhost',
  user: 'your_username',
  password: 'your_password',
  database: 'your_database',
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});

// Multer configuration for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Sign Up API
app.post('/signup', (req, res) => {
  // Handle signup logic and save user to the database
  // ...

  // Send response
  res.json({ message: 'User signed up successfully' });
});

// Login API
app.post('/login', (req, res) => {
  // Handle login logic and authenticate user
  // ...

  // Send response with user data
  const user = {
    id: 1,
    username: 'john.doe',
    email: 'john@example.com',
  };

  res.json({ user });
});

// Update Profile API with multiple file upload
app.post('/update-profile', upload.array('images', 2), (req, res) => {
  // Handle profile update logic
  // ...

  // Send response
  res.json({ message: 'Profile updated successfully' });
});

// Admin Dashboard API to fetch users list
app.get('/admin/users', (req, res) => {
  // Fetch users from the database
  db.query('SELECT * FROM users', (err, results) => {
    if (err) throw err;

    // Send response with users list
    res.json({ users: results });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
