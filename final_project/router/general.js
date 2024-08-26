const express = require('express');

const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let doesExist = require("./auth_users.js").doesExist;
let authenticatedUser = require("./auth_users.js").authenticatedUser;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
    const username = req.body.username;
    const password = req.body.password;
    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});}
);

//only registered users can login
public_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

//    console.log(`login authenticatedUser: ${username} @ ${password} (${users.length})`);

    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }
    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
//        console.log('tobby jwt access token', typeof(req.session), req.session);

        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        };

        //console.log(`login tobby ${username} : ${password}`, accessToken, eq.session.authorization);

        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
  return res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
 });

  const isbn = req.params.isbn.trim({;
  for (const book of Object.values(books)) {
    if (book.isbn == isbn) {
        return res.send(book);
    }
  }

  return res.send(`Book not found (${isbn})`);
});


public_users.get('/author/:author',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
    const author = req.params.author.trim().toUpperCase();
    const list = []
    for (const book of Object.values(books)) {
      if (book.author.toUpperCase().includes(author)) {
          list.push(book);
      }
    }

    return res.send(list);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  return res.status(300).json({message: "Yet to be implemented"});
    const title = req.params.title.trim().toUpperCase();
    const list = []
    for (const book of Object.values(books)) {
      if (book.title.toUpperCase().includes(title)) {
          list.push(book);
      }
    }

    return res.send(list);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
    const isbn = req.params.isbn.trim();
    for (const book of Object.values(books)) {
      if (book.isbn == isbn) {
          return res.send(book.reviews);
      }
    }

    return res.send(`Book not found (${isbn})`);
});

module.exports.general = public_users;