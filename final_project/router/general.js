const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const user = req.body;
  
    if (!user.username || !user.password)
      return res
        .status(400)
        .json({ message: "Username and password are required!" });
  
    if (!isValid(user.username))
      return res.status(400).json({ message: "Username is already used!" });

    users.push(user)
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
    const response = await simulate(() => books);
    return res.status(300).json(response);
  });
  
  // Get book details based on ISBN
  public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params["isbn"];
    const response = await simulate(() => books[isbn]);
    return res.status(300).json({message: "Yet to be implemented"});
   });
  
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    const author = req.params["author"];

    const response = await simulate(() => {
      const booksKeys = Object.keys(books);
  
      const booksByAuthor = {};
  
      booksKeys.forEach((key) => {
        if (books[key].author === author) booksByAuthor[key] = books[key];
      });
  
      return booksByAuthor;
    });
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    const title = req.params["title"];

    const response = await simulate(() => {
      const booksKeys = Object.keys(books);
  
      const booksByTitle = {};
  
      booksKeys.forEach((key) => {
        if (books[key].title === title) booksByTitle[key] = books[key];
      });
  
      return booksByTitle;
    });
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params["isbn"];
    const book = books[isbn];
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
