const express = require('express');
const public_users = express.Router();
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users
public_users.post("/register", (req, res) => {
    const user = req.body;
    if (!user.username || !user.password) {
        return res.status(400).json({ message: "Username and password are required!" });
    }

    if (!isValid(user.username)) {
        return res.status(400).json({ message: "Username is already used!" });
    }

    users.push(user);
    return res.status(201).json({ message: "User registered successfully" });
});

function simulate(callback) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(callback());
        }, 1000); 
    });
}
public_users.get("/", async (req, res) => {
    const response = await simulate(() => books);
    return res.status(200).json(response);
});

// Получение книги по ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
    const isbn = req.params["isbn"];
    const book = books[isbn];
    
    if (book) {
        const response = await simulate(() => book);
        return res.status(200).json(response);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});
public_users.get('/author/:author', async (req, res) => {
    const author = req.params["author"];
    
    const response = await simulate(() => {
        const booksKeys = Object.keys(books);
        const booksByAuthor = {};
        
        booksKeys.forEach((key) => {
            if (books[key].author === author) {
                booksByAuthor[key] = books[key];
            }
        });
        
        return booksByAuthor;
    });
    
    return res.status(200).json(response);
});
public_users.get('/title/:title', async (req, res) => {
    const title = req.params["title"];
    
    const response = await simulate(() => {
        const booksKeys = Object.keys(books);
        const booksByTitle = {};
        
        booksKeys.forEach((key) => {
            if (books[key].title === title) {
                booksByTitle[key] = books[key];
            }
        });
        
        return booksByTitle;
    });
    
    return res.status(200).json(response);
});
public_users.get('/review/:isbn', async (req, res) => {
    const isbn = req.params["isbn"];
    const book = books[isbn];
    
    if (book) {
        const response = await simulate(() => book.reviews);
        return res.status(200).json(response);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

module.exports = public_users;
