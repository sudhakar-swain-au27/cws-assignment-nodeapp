const express = require('express');
const multer = require('multer');
const mysql = require('mysql2');

const app = express();
const port = 3000;

// Database configuration
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Nokia@123',
  database: 'cws',
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});

// Multer configuration for file upload where i can use multiple file to upload .
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
    // Get user data from the request body
    const { username, email, password } = req.body;
  
    // Validate user data 
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Please provide all the required fields' });
    }
  
    // Check if the user already exists in the database 
    const checkUserQuery = 'SELECT * FROM users WHERE email = ?';
    db.query(checkUserQuery, [email], (err, results) => {
      if (err) {
        console.error('Error checking user:', err);
        return res.status(500).json({ message: 'An error occurred' });
      }
  
      if (results.length > 0) {
        return res.status(409).json({ message: 'User with this email already exists' });
      }
  
      // Insert the new user into the database
      const insertUserQuery = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
      db.query(insertUserQuery, [username, email, password], (err, result) => {
        if (err) {
          console.error('Error inserting user:', err);
          return res.status(500).json({ message: 'An error occurred' });
        }
  
        // Send response
        res.status(201).json({ message: 'User signed up successfully' });
      });
    });
  });
  // Login API
app.post('/login', (req, res) => {
    // Get user credentials from the request body
    const { email, password } = req.body;
  
    // Validate user credentials
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }
  
    // Check if the user exists in the database and verify the credentials
    const checkUserQuery = 'SELECT * FROM users WHERE email = ? AND password = ?';
    db.query(checkUserQuery, [email, password], (err, results) => {
      if (err) {
        console.error('Error checking user:', err);
        return res.status(500).json({ message: 'An error occurred' });
      }
  
      if (results.length === 0) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
  
      // User authenticated, send response with user data
      const user = {
        id: results[0].id,
        username: results[0].username,
        email: results[0].email,
      };
  
      res.json({ user });
    });
  });
  

// Update Profile API with multiple file upload
app.post('/update-profile', upload.array('images', 2), (req, res) => {
    // Get user ID from the request 
    const userId = req.userId; 
  
    const files = req.files;
  
    // Check if files were uploaded
    if (!files || files.length === 0) {
      return res.status(400).json({ message: 'Please upload at least one file' });
    }
  
    // Process the uploaded files 
    const fileUrls = files.map((file) => file.path);

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
