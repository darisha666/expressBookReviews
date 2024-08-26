const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
let users = [];

const isValid = (username)=>{
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

 //if username and password match the one we have in records.
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
    const user = users.find(u => u.username === username);
    if (!user) {
        return res.status(401).json({ message: "Invalid username or password" });
    }

    // Проверяем, совпадает ли пароль
    if (user.password !== password) {
        return res.status(401).json({ message: "Invalid username or password" });
    }

    // Создаем и возвращаем токен (например, JWT) или устанавливаем сессию
    // В этом примере просто возвращаем успешное сообщение
    return res.status(200).json({ message: "Login successful", user: username });
});

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
