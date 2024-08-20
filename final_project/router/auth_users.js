const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    return !users.find((item) => item.username === username);
};

const authenticatedUser = (username, password) => {
    return users.some((user) => user.username === username && user.password === password);
};

// Login route
regd_users.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(400).json({ message: "The username and password are required!" });
    }

    if (authenticatedUser(username, password)) {
        const accessToken = jwt.sign({ username }, "access", { expiresIn: '1h' });
        req.session.authorization = { accessToken, username };
        return res.status(200).json({ accessToken, username });
    } else {
        return res.status(400).json({ message: "Invalid Login. Check username and password" });
    }
});

// Middleware для проверки аутентификации
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, "access", (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Добавление рецензии
regd_users.put("/auth/review/:isbn", authenticateToken, (req, res) => {
    const isbn = req.params["isbn"];
    const { review, rating } = req.body;
    const user = req.user;

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    if (!review || !rating) {
        return res.status(400).json({ message: "Review and rating are required" });
    }

    books[isbn].reviews[user.username] = { review, rating };
    return res.status(200).json({ [isbn]: books[isbn] });
});

// Удаление рецензии
regd_users.delete("/auth/review/:isbn", authenticateToken, (req, res) => {
    const isbn = req.params["isbn"];
    const user = req.user;

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    if (!books[isbn].reviews[user.username]) {
        return res.status(404).json({ message: "Review not found" });
    }

    delete books[isbn].reviews[user.username];
    return res.status(200).json({ message: "Review deleted successfully" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
module.exports = regd_users;
