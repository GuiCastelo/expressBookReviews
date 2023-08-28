const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const authenticatedUser = (username,password) => {
  const user = users.find((user) => (user.username === username && user.password === password));
  return user ? true : false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if(authenticatedUser(username, password)) {
    const accessToken = jwt.sign({
      data: { username, password }
    }, 'access', { expiresIn: 60*60 });
    req.session.authorization = {
      accessToken, username
    };
    return res.status(200).json({ message: 'User successfully logged in' });
  }

  return res.status(404).json({ message: 'Invalid login. Check if username and passwod provided are correct' });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const user = req.user.data.username;
  let reviews = books[req.params.isbn].reviews;

  if(!reviews) {
    res.status(404).json({ message: 'There is no book with this ISBN' });
  }

  let userReview = reviews.find((review) => review.username === user);
  userReview ?
    userReview.review = req.query.review :
    reviews.push({ username: user, review: req.query.review });
    
  return res.status(200).json({message: "Review successfuly submited"});
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const user = req.user.data.username;
  const reviews = books[req.params.isbn].reviews;

  if(!reviews) {
    res.status(404).json({ message: 'There is no book with this ISBN' });
  }

  books[req.params.isbn].reviews = reviews.filter((review) => review.username !== user);
    
  return res.status(200).json({message: "Review successfuly deleted"});
});

module.exports.authenticated = regd_users;
module.exports.users = users;
