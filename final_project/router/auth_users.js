const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
return !users.find((item) => item.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
 let validusers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  
  return validusers.length > 0;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
   const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "The username and password is required!" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      {
        username,
      },
      "access",
      { expiresIn: 60 * 60 }
    );

    req.session.authorization = {
      accessToken,
      username,
    };

    return res.status(200).send({ accessToken, username });
  } else {
    return res
      .status(400)
      .json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
   const isbn = req.params["isbn"];
  const { review, rating } = req.body;
  const user = req.user;

  if (!books[isbn]) {
    return res.status(400).json({ message: "Book not found" });
  }

  if (!review || !rating) {
    return res.status(400).json({ message: "Review and rating are required" });
  }

  books[isbn].reviews[user.username] = { review, rating };

  return res.status(300).json({ [isbn]: books[isbn] });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params["isbn"];
  const user = req.user;

  if (!books[isbn]) {
    return res.status(400).json({ message: "Book not found" });
  }

  if (!books[isbn].reviews[user.username]) {
    return res.status(400).json({ message: "Review not found" });
  }

  delete books[isbn].reviews[user.username];
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
