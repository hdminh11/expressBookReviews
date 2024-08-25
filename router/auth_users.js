const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{
    // Filter the users array for any user with the same username
    const userWithTheSameName = users.filter(user => user.username == username);
    return userWithTheSameName.length > 0;
}

const authenticatedUser = (username, password)=>{
    // Filter the users array for any user with the same username and password
    let validUsers = users.filter(user => user.username === username && user.password === password);
    // Return true if any valid user is found, otherwise false
    return validUsers.length > 0;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if username or password is missing
  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  // Check user authenticate
  if (authenticatedUser(username, password)) {
    // Generate JWT
    let accessToken = jwt.sign({
      username: username,
    }, "access", { expiresIn: 60 * 60 });

    // Store access token and username in session
    req.session.authorization = {
      accessToken,
      username,
    }
    return res.status(200).send("User successfully logged in");
  }
  return res.status(208).json({ message: "Invalid Login. Check username and password" });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  // Get book's isbn
  const isbn = req.params.isbn;

  // Get username
  const username = req.user['username'];

  // Get review content
  const review = req.body.review;

  // Get book review
  const bookReview = books[isbn]["reviews"];

  // Update book review
  bookReview[username] = review;
  books[isbn]["reviews"] = bookReview;

  return res.status(200).json(books[isbn]);
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  // Get book's isbn
  const isbn = req.params.isbn;

  // Get username
  const username = req.user['username'];

  // Get book review
  const bookReview = books[isbn]["reviews"];

  if (bookReview[username]) {
    delete bookReview[username];
  }
  return res.status(200).json(books[isbn]);
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
