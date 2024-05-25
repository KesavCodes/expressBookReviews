const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Error logging in. Not a valid email or password." });
  }
  if (isValid(username)) {
    return res.status(400).json({ message: "Username already exists" });
  }
  users.push({ username, password });
  return res.json({
    message: "User successfully registered. Now you can login",
  });
});

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
  //Write your code here
  return await new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(res.status(200).json(Object.values(books)));
    }, 1000);
  });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if (!Object.hasOwn(books, isbn)) {
    return await new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(
          res.status(404).json({ message: "Book not found with isbn: " + isbn })
        );
      }, 1000);
    });
  }
  return await new Promise((resolve, reject) =>
    setTimeout(resolve(res.json(books[isbn])), 1000)
  );
});

// Get book details based on author
public_users.get("/author/:author", async function (req, res) {
  //Write your code here
  const author = req.params.author;
  const booksByAuthor = Object.values(books).filter(
    (record) => record.author.toLowerCase() === author.toLowerCase()
  );
  if (!booksByAuthor.length)
    return await new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(
          res
            .status(404)
            .json({ message: "Book not found with author: " + author })
        );
      }, 1000);
    });

  return await new Promise((resolve, reject) =>
    setTimeout(resolve(res.json(booksByAuthor)), 1000)
  );
});

// Get all books based on title
public_users.get("/title/:title", async function (req, res) {
  //Write your code here
  const title = req.params.title;
  const booksByTitle = Object.values(books).filter(
    (record) => record.title.toLowerCase() === title.toLowerCase()
  );
  if (!booksByTitle.length)
    return await new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(
          res
            .status(404)
            .json({ message: "Book not found with title: " + title })
        );
      }, 1000);
    });
  return await new Promise((resolve, reject) =>
    setTimeout(resolve(res.json(booksByTitle)), 1000)
  );
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if (!Object.hasOwn(books, isbn)) {
    return res
      .status(404)
      .json({ message: "Book not found with isbn: " + isbn });
  }
  return res.json(books[isbn].reviews);
});

module.exports.general = public_users;
