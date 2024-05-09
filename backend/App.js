const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 4000;
app.use(cors());
app.use(express.json());
const mysql = require("mysql2");

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Hello124$",
  database: "final_319",
});
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL: " + err.stack);
    return;
  }
  console.log("Connected to MySQL as id " + connection.threadId);
});

app.get("/users", (req, res) => {
  const query = "SELECT * FROM users";

  connection.query(query, (error, results) => {
    if (error) {
      console.error("Error querying database: " + error.stack);
      return res.status(500).json({ error: "Internal server error" });
    }
    // Return the list of users as JSON response
    res.json(results);
  });
});

function checkExistingUser(username, email, callback) {
  const query = "SELECT * FROM users WHERE username = ? OR email = ?";
  connection.query(query, [username, email], (error, results) => {
    if (error) {
      return callback(error);
    }
    callback(null, results.length > 0);
  });
}

// Function to create a new user
function createUser(username, email, password, callback) {
  const query =
    "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
  connection.query(query, [username, email, password], (error, results) => {
    if (error) {
      return callback(error);
    }
    callback(null, results.insertId);
  });
}

function checkExistingCategory(category_name, callback) {
  const query = "SELECT * FROM categories WHERE category_name = ?";
  connection.query(query, [category_name], (error, results) => {
    if (error) {
      return callback(error);
    }
    callback(null, results);
  });
}

// function checkExistingCategoryId(category_id, callback) {
//   const query = "SELECT * FROM categories WHERE category_id = ?";
//   connection.query(query, [category_id], (error, results) => {
//     if (error) {
//       return callback(error);
//     }
//     callback(null, results);
//   });
// }

app.get("/", (req, res) => {
  res.send("Welcome to Academic Navigator!");
});

// Signup
app.post("/signup", (req, res) => {
  const { username, email, password } = req.body;

  // Check if username or email already exist
  checkExistingUser(username, email, (error, exists) => {
    if (error) {
      console.error("Error querying database: " + error.stack);
      return res.status(500).json({ error: "Internal server error" });
    }
    if (exists) {
      return res
        .status(400)
        .json({ error: "Username or email already exists" });
    }
    // Create user if username and email are unique
    createUser(username, email, password, (error, userId) => {
      if (error) {
        console.error("Error querying database: " + error.stack);
        return res.status(500).json({ error: "Internal server error" });
      }
      res.status(201).json({ message: "User created successfully", userId });
    });
  });
});

//login
app.post("/login", (req, res) => {
  // Extract username/email and password from request body
  const { usernameOrEmail, password } = req.body;

  // Query to check if the username or email exists in the database and retrieve user data
  const query =
    "SELECT user_id, username, email, password FROM users WHERE username = ? OR email = ?";
  connection.query(
    query,
    [usernameOrEmail, usernameOrEmail],
    (error, results) => {
      if (error) {
        console.error("Error querying database: " + error.stack);
        return res.status(500).json({ error: "Internal server error" });
      }

      // Check if a user with the provided username/email exists
      if (results.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      const user = results[0];

      if (password !== user.password) {
        return res.status(401).json({ error: "Incorrect password" });
      }

      res.json({ user_id: user.user_id });
    }
  );
});

// Route to delete a user by user_id
app.delete('/users/delete/:user_id', (req, res) => {
  const user_id = req.params.user_id;

  // Delete the user from the database
  const query = 'DELETE FROM users WHERE user_id = ?';
  connection.query(query, [user_id], (error, results) => {
    if (error) {
      console.error('Error deleting user:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (results.affectedRows === 0) {
      // No user found with the provided user_id
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  });
});

// Create a category
// app.post("/addcategories", (req, res) => {
//   const { category_name } = req.body;

//   // Check if the category name is provided
//   if (!category_name) {
//     return res.status(400).json({ error: "Category name is required" });
//   }

//   checkExistingCategory(category_name, (error, results) => {
//     if (error) {
//       return res.status(500).json({ error: "Internal server error" });
//     }
//     if (results.length > 0) {
//       return res.status(400).json({ error: "category already exists" });
//     }
//     // Insert the new category into the database
//     connection.query(
//       "INSERT INTO categories (category_name) VALUES (?)",
//       [category_name],
//       (error, results) => {
//         if (error) {
//           console.error("Error creating category: " + error.stack);
//           return res.status(500).json({ error: "Internal server error" });
//         }

//         res.status(201).json({
//           message: "Category created successfully",
//           category_id: results.insertId,
//         });
//       }
//     );
//   });
// });

// // Get a category by its ID
// app.post("/getcategories/id", (req, res) => {
//   const categoryId = req.body.category_id;

//   connection.query(
//     "SELECT * FROM categories WHERE category_id = ?",
//     [categoryId],
//     (error, results) => {
//       if (error) {
//         console.error("Error fetching category: " + error.stack);
//         return res.status(500).json({ error: "Internal server error" });
//       }

//       if (results.length === 0) {
//         return res.status(404).json({ error: "Category not found" });
//       }

//       res.json(results[0]);
//     }
//   );
// });

// // Get a category by its name
// app.post("/getcategories/name", (req, res) => {
//   const category_name = req.body.category_name;

//   checkExistingCategory(category_name, (error, results) => {
//     if (error) {
//       console.error("Error fetching category: " + error.stack);
//       return res.status(500).json({ error: "Internal server error" });
//     }

//     if (results.length === 0) {
//       return res.status(404).json({ error: "Category not found" });
//     }

//     res.json(results[0]);
//   });
// });

// // Delete a category by its ID
// app.delete("/deletecategories/:categoryId", (req, res) => {
//   const categoryId = req.params.categoryId;

//   connection.query(
//     "DELETE FROM categories WHERE category_id = ?",
//     [categoryId],
//     (error, results) => {
//       if (error) {
//         console.error("Error deleting category: " + error.stack);
//         return res.status(500).json({ error: "Internal server error" });
//       }

//       if (results.affectedRows === 0) {
//         return res.status(404).json({ error: "Category not found" });
//       }

//       res.json({ message: "Category deleted successfully" });
//     }
//   );
// });

// Create a todo
app.post('/todos/add/:user_id', (req, res) => {
  const user_id = req.params.user_id;
  const {Title, description} = req.body;

  // Check if required fields are provided
  if (!user_id || !Title ) {
    return res.status(400).json({ error: 'userId and title are required fields' });
  }

  // Set default status to "Open"
  const Status = "Open";

  //Insert new todo into database
  connection.query('INSERT INTO todos (user_id, Title, description, Status) VALUES (?, ?, ?, ?)', 
      [user_id, Title, description, Status], 
      (error, results) => {
        if (error) {
          console.error('Error creating todo: ' + error.stack);
          return res.status(500).json({ error: 'Internal server error' });
        }

        res.status(201).json({ message: 'Todo created successfully', Id: results.insertId });
      }
    );


  // // Fetch the highest rank_id for todos in the same category
  // connection.query('SELECT MAX(rank_id) AS maxRank FROM todos WHERE user_id = ? && category_id = ?', [user_id,category_id], (error, results) => {
  //   if (error) {
  //     console.error('Error fetching max rank_id: ' + error.stack);
  //     return res.status(500).json({ error: 'Internal server error' });
  //   }

  //   // Determine the next rank_id
  //   const nextRankId = (results[0].maxRank || 0) + 1;

  //   // Insert the new todo into the database
    // connection.query('INSERT INTO todos (user_id, title, description, due_date, status, category_id, rank_id) VALUES (?, ?, ?, ?, ?, ?, ?)', 
    //   [user_id, Title, description, dueDate, status, category_id, nextRankId], 
    //   (error, results) => {
    //     if (error) {
    //       console.error('Error creating todo: ' + error.stack);
    //       return res.status(500).json({ error: 'Internal server error' });
    //     }

    //     res.status(201).json({ message: 'Todo created successfully', todo_id: results.insertId });
    //   }
    // );
  // });
});


// Get all todos for a user
app.get('/todos/get/:user_id', (req, res) => {
  const user_id = req.params.user_id;

  // Fetch todos for the specified category
  connection.query('SELECT * FROM todos WHERE user_id = ?', [user_id], (error, results) => {
    if (error) {
      console.error('Error fetching todos: ' + error.stack);
      return res.status(500).json({ error: 'Internal server error' });
    }

    res.status(200).json(results);
  });
});

// Delete a todo by ID
app.delete('/todos/delete/:Id', (req, res) => {
  const Id = req.params.Id;

  // Delete the todo from the database
  connection.query('DELETE FROM todos WHERE Id = ?', [Id], (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }

    // Check if a todo was deleted
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.status(200).json({ message: 'Todo deleted successfully' });
  });
});

// Change the category for a todo by ID
// app.put('/todos/changecategory/:todo_id/category_id', (req, res) => {
//   const todo_id = req.params.todo_id;
//   const new_category_id = req.body.category_id;

//   // Check if the new category ID is provided
//   if (!new_category_id) {
//     return res.status(400).json({ error: 'New category ID is required' });
//   }

//   // Check if the new category exists
//   connection.query('SELECT * FROM categories WHERE category_id = ?', [new_category_id], (error, results) => {
//     if (error) {
//       return res.status(500).json({ error: 'Internal server error from not finding category' });
//     }

//     if (results.length === 0) {
//       return res.status(404).json({ error: 'No category not found' });
//     }

//     // Update the category for the todo in the database
//     connection.query('UPDATE todos SET category_id = ? WHERE todo_id = ?', [new_category_id, todo_id], (error, results) => {
//       if (error) {
//         return res.status(500).json({ error: 'Internal server error from not updating category' });
//       }

//       // Check if a todo was updated
//       if (results.affectedRows === 0) {
//         return res.status(404).json({ error: 'Todo not found' });
//       }

//       res.status(200).json({ message: 'Todo category updated successfully' });
//     });
//   });
// });

// Change the category for a todo
// app.put('/todos/changecategory', (req, res) => {
//   const { todo_id, category_id } = req.body;


//   // Update the category for the todo in the database
//   connection.query('UPDATE todos SET category_id = ? WHERE todo_id = ?', [category_id, todo_id], (error, results) => {
//     if (error) {
//       console.error('Error updating todo category: ' + error.stack);
//       return res.status(500).json({ error: 'Internal server error' });
//     }

//     // Check if a todo was updated
//     if (results.affectedRows === 0) {
//       return res.status(404).json({ error: 'Todo not found' });
//     }

//     res.status(200).json({ message: 'Todo category updated successfully' });
//   });
// });

// Change the rank_id for a todo
// app.put('/todos/changerank', (req, res) => {
//   const { todo_id, new_rank_id} = req.body;

//   // Fetch the current todo's category_id and user_id
//   connection.query('SELECT category_id, user_id, rank_id FROM todos WHERE todo_id = ?', [todo_id], (error, results) => {
//     if (error) {
//       console.error('Error fetching todo details: ' + error.stack);
//       return res.status(500).json({ error: 'Internal server error' });
//     }

//     if (results.length === 0) {
//       return res.status(404).json({ error: 'Todo not found' });
//     }

//     const { category_id, user_id, rank_id } = results[0];

//     // Fetch the maximum rank_id for the user_id and category_id
//     connection.query('SELECT MAX(rank_id) AS max_rank FROM todos WHERE category_id = ? AND user_id = ?', [category_id, user_id], (error, results) => {
//       if (error) {
//         console.error('Error fetching maximum rank: ' + error.stack);
//         return res.status(500).json({ error: 'Internal server error' });
//       }

//       const max_rank = results[0].max_rank;

//       // Check if new_rank_id exceeds the maximum rank
//       if (new_rank_id > max_rank) {
//         return res.status(400).json({ error: 'New rank exceeds maximum rank' });
//       }

//       // If new_rank_id is less than the current rank_id, update the ranks of other todos
//       if (new_rank_id < rank_id) {
//         // Increment the rank of todos with rank_id >= new_rank_id
//         connection.query('UPDATE todos SET rank_id = rank_id + 1 WHERE category_id = ? AND user_id = ? AND rank_id >= ? AND rank_id < ?', [category_id, user_id, new_rank_id, rank_id], (error, results) => {
//           if (error) {
//             console.error('Error updating ranks: ' + error.stack);
//             return res.status(500).json({ error: 'Internal server error' });
//           }

//           // Update the rank_id of the current todo
//           connection.query('UPDATE todos SET rank_id = ? WHERE todo_id = ?', [new_rank_id, todo_id], (error, results) => {
//             if (error) {
//               console.error('Error updating todo rank: ' + error.stack);
//               return res.status(500).json({ error: 'Internal server error' });
//             }

//             res.status(200).json({ message: 'Todo rank updated successfully' });
//           });
//         });
//       } else {
//         // If new_rank_id is equal to the current rank_id, no need to update ranks
//         // Update the rank_id of the current todo
//         connection.query('UPDATE todos SET rank_id = ? WHERE todo_id = ?', [new_rank_id, todo_id], (error, results) => {
//           if (error) {
//             console.error('Error updating todo rank: ' + error.stack);
//             return res.status(500).json({ error: 'Internal server error' });
//           }

//           res.status(200).json({ message: 'Todo rank updated successfully' });
//         });
//       }
//     });
//   });
// });

// Assuming you have initialized your Express app and set up your routes and database connection

// Route to change the status of a todo
app.put('/todos/:Id/status', (req, res) => {
  const { Id } = req.params;
  const {Status } = req.body;

  // Check if the todo exists
  connection.query('SELECT * FROM todos WHERE Id = ?', [Id], (error, results) => {
    if (error) {
      console.error('Error checking todo existence:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (results.length === 0) {
      // Todo not found
      return res.status(404).json({ error: 'Todo not found' });
    }

    // Todo exists, update its status
    let statusText;
    switch (Status) {
      case 1:
        statusText = 'Open';
        break;
      case 2:
        statusText = 'InProgress';
        break;
      case 3:
        statusText = 'Close';
        break;
      default:
        return res.status(400).json({ error: 'Invalid status value' });
    }

    connection.query('UPDATE todos SET Status = ? WHERE Id = ?', [statusText, Id], (error, results) => {
      if (error) {
        console.error('Error updating todo status:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }
      res.status(200).json({ message: 'Todo status updated successfully' });
    });
  });
});

// GET request to fetch all events for a user
app.get('/events/:user_id', (req, res) => {
  const userId = req.params.user_id;

  // Query to fetch events for the specified user
  const query = 'SELECT * FROM events WHERE user_id = ?';
  connection.query(query, [userId], (error, results) => {
    if (error) {
      console.error('Error fetching events:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.status(200).json(results); // Send events data as JSON response
  });
});

// POST request to add an event
app.post('/events/add/:user_id', (req, res) => {
  const userId = req.params.user_id;
  const eventData = req.body;

  // Insert the event into the database
  const query = 'INSERT INTO events (user_id, Subject, Location, StartTime, EndTime) VALUES (?, ?, ?, ?, ?)';
  connection.query(query, [userId, eventData.Subject, eventData.Location, eventData.StartTime, eventData.EndTime], (error, results) => {
    if (error) {
      console.error('Error adding event:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.status(201).json({ message: 'Event added successfully', event_id: results.insertId });
  });
});
