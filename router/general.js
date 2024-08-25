const express = require('express');
let books = require("./booksdb.js");
const { searchBookByKeyAndValue } = require('../utils/index.js');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  // Get username, password in Body
  const body = req.body;
  const username = body.username;
  const password = body.password;

  if (username && password) {
    // Check username exist
    const doesExist = isValid(users, username);

    if (!doesExist) {
      // Add the new user to the users array
      users.push({"username": username, "password": password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(400).json({message: `User with username:${username} already exists!`});
    }
  }
  // Return error if username or password is missing
  return res.status(400).json({message: "Unable to register user. Please check your username and password!"});
});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  // Get isbn param in url
  const isbn = req.params.isbn;
  // Return book by isbn
  return res.status(200).json(books[isbn])
 });
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  // Get author param in url
  const author = req.params.author;

  // Get books by author
  const booksByAuthor = await searchBookByKeyAndValue(books, "author", author);
  return res.status(200).json(booksByAuthor)
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  // Get author param in url
  const title = req.params.title;

  // Get books by title
  const booksByTitle = await searchBookByKeyAndValue(books, "title", title);
  return res.status(200).json(booksByTitle)
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  // Get isbn param in url
  const isbn = req.params.isbn;
  // Return book's review by isbn
  return res.status(200).json(books[isbn]['reviews'])
});

module.exports.general = public_users;
