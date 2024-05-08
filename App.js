const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 4000;
app.use(cors());
app.use(express.json());
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');


app.listen(PORT, () => {
console.log(`Server is running on ${PORT}`);
});
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Hello124$',
  database: 'final_319'
});
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL as id ' + connection.threadId);
});

app.get('/users', (req, res) => {
  const query = 'SELECT * FROM users';

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error querying database: ' + error.stack);
      return res.status(500).json({ error: 'Internal server error' });
    }
    // Return the list of users as JSON response
    res.json(results);
  });
});

function checkExistingUser(username, email, callback) {
  const query = 'SELECT * FROM users WHERE username = ? OR email = ?';
  connection.query(query, [username, email], (error, results) => {
    if (error) {
      return callback(error);
    }
    callback(null, results.length > 0);
  });
}

// Function to create a new user
function createUser(username, email, password, callback) {
  const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
  connection.query(query, [username, email, password], (error, results) => {
    if (error) {
      return callback(error);
    }
    callback(null, results.insertId);
  });
}

// Signup
app.post('/signup', (req, res) => {
  const { username, email, password } = req.body;

  // Check if username or email already exist
  checkExistingUser(username, email, (error, exists) => {
    if (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (exists) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }
    // Create user if username and email are unique
    createUser(username, email, password, (error, userId) => {
      if (error) {
        return res.status(500).json({ error: 'Internal server error' });
      }
      res.status(201).json({ message: 'User created successfully', userId });
    });
  });
});

//login
app.post('/login', (req, res) => {
  // Extract username/email and password from request body
  const { usernameOrEmail, password } = req.body;

  // Query to check if the username or email exists in the database and retrieve user data
  const query = 'SELECT id, username, email, password FROM users WHERE username = ? OR email = ?';
  connection.query(query, [usernameOrEmail, usernameOrEmail], (error, results) => {
    if (error) {
      console.error('Error querying database: ' + error.stack);
      return res.status(500).json({ error: 'Internal server error' });
    }

    // Check if a user with the provided username/email exists
    if (results.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = results[0];

    if (password !== user.password) {
      return res.status(401).json({ error: 'Incorrect password' });
    }

    res.json({ message: 'Login successful', userId: user.id });

  });
});