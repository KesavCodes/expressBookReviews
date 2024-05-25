const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
  return users.some((user) => user.username === username);
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
  return users.some(
    (user) => user.username === username && user.password === password
  );
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }
  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      {
        data: password,
      },
      "access",
      { expiresIn: 60 * 60 }
    );

    req.session.authorization = {
      accessToken,
      username,
    };
    return res.status(200).json({ message: "User successfully logged in" });
  } else {
    return res
      .status(208)
      .json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const { username } = req.session.authorization;
  if (!Object.hasOwn(books, isbn)) {
    return res
      .status(404)
      .json({ message: "Book not found with isbn: " + isbn });
  }
  const userReview = books[isbn]["reviews"].findIndex(
    (record) => record.username === username
  );
  if (userReview === -1) {
    books[isbn]["reviews"].push({
      username,
      rating: req.body.rating,
      comment: req.body.comment,
    });
  } else {
    userReview.rating = req.body.rating ?? userReview.rating;
    userReview.comment = req.body.comment ?? userReview.comment;
  }

  return res.json({ message: "Review updated successfully!" });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  console.log("hello")
  const isbn = req.params.isbn;
  const { username } = req.session.authorization;
  if (!Object.hasOwn(books, isbn)) {
    return res
      .status(404)
      .json({ message: "Book not found with isbn: " + isbn });
  }

  const userReview = books[isbn]["reviews"].findIndex(
    (record) => record.username === username
  );

  if (userReview === -1)
    return res
      .status(404)
      .json({ message: "No review for this book from user " + username });

  books[isbn]["reviews"] = books[isbn]["reviews"].filter(
    (record) => record.username !== username
  );

  return res.json({ message: "Review deleted successfully!" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
