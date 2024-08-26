const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
// Check if the user with the given username and password exists
const authenticatedUser = (username, password) => {
    // Filter the users array for any user with the same username and password
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });


    //console.log(`authenticatedUser: ${username} @ ${password} (${users.length})`, validusers.length > 0);

    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

// Check if a user with the given username already exists
const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});


// Add a book review
regd_users.put("/review/:isbn", (req, res) => {
    const isbn = req.params.isbn.trim();
    const username = (((req.session??"").authorization??"").username??"");
    const rating = req.body.rating;
    const remark = req.body.remark;

    if (!rating || !remark || !username) {
        return res.status(404).json({ message: "Error rating" });
    }

    for (const book of Object.values(books)) {
      if (book.isbn == isbn) {
          book.reviews[username] = {
            rating: rating,
            remark: remark
          }

          return res.send(`Review updated (${isbn})`);
      }
    }

    return res.send(`Book not found (${isbn})`);
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
regd_users.delete("/review/:isbn", (req, res) => {
    const isbn = req.params.isbn.trim();
    const username = (((req.session??"").authorization??"").username??"");

    if ( !username) {
        return res.status(404).json({ message: "Error rating" });
    }

    for (const book of Object.values(books)) {
      if (book.isbn == isbn) {
          delete book.reviews[username];

          return res.send(`Review deleted (${isbn})`);
      }
    }

    return res.send(`Book not found (${isbn})`);
});

module.exports.authenticatedUser = authenticatedUser;
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.doesExist = doesExist;
module.exports.users = users;
module.exports = regd_users;
