const express = require('express');
let books = require("./booksdb.js");
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if(!username) {
    return res.status(400).json({ message: 'Username not informed' });
  }

  if(!password) {
    return res.status(400).json({ message: 'Password not informed' });
  }

  if(users.find((user) => user.username === username)) {
    return res.status(400).json({ message: `User ${username} already registered` });
  }

  users.push({ username, password });
  return res.status(201).json({message: `User ${username} successfully registered. Now you can login` });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbnBook = books[req.params.isbn];
  return isbnBook ? 
    res.status(200).json(isbnBook) : 
    res.status(404).json({ message: 'There is no book with this ISBN' });
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const authorBook = Object.values(books).filter((book) => book.author === req.params.author);
  return authorBook ?
    res.status(200).json(authorBook) :
    res.status(404).json({ message: 'There is no book with this author' });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const titleBook = Object.values(books).filter((book) => book.title === req.params.title);
  return titleBook ?
    res.status(200).json(titleBook) :
    res.status(404).json({ message: 'There is no book with this title' });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const reviews = books[req.params.isbn].reviews;
  return reviews ?
    res.status(200).json(reviews):
    res.status(404).json({ message: 'There is no book with this ISBN' });
});

module.exports.general = public_users;
