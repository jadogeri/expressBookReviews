const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
  let userswithsamename = users.filter((user) => {
    return user.username === username
  });
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
}


public_users.post("/register", (req, res) => {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  const username = req.body.username;
  const password = req.body.password;


  if (username && password) {
    if (!doesExist(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registred. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });

});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  res.send(JSON.stringify(books, null, 4));


});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  const ISBN = req.params.isbn;

  res.send(books[ISBN])

});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  //Write your code here
  // return res.status(300).json({message: "Yet to be implemented"});
  let answer = []
  for (const [key, values] of Object.entries(books)) {
    const book = Object.entries(values);
    for (let i = 0; i < book.length; i++) {
      if (book[i][0] == 'author' && book[i][1] == req.params.author) {
        answer.push(books[key]);
      }
    }
  }
  if (answer.length == 0) {
    return res.status(300).json({ message: "Author not found" });
  }
  res.send(answer);

});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  let answer = []
  for (const [key, values] of Object.entries(books)) {
    const book = Object.entries(values);
    for (let i = 0; i < book.length; i++) {
      if (book[i][0] == 'title' && book[i][1] == req.params.title) {
        answer.push(books[key]);
      }
    }
  }
  if (answer.length == 0) {
    return res.status(300).json({ message: "Title not found" });
  }
  res.send(answer);


});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  const ISBN = req.params.isbn;
  res.send(books[ISBN].reviews)

});

// Task 10 

function getBookList() {
  return new Promise((resolve, reject) => {
    resolve(books);
  })
}

public_users.get('/', function (req, res) {
  getBookList().then(
    (bk) => res.send(JSON.stringify(bk, null, 4)),
    (error) => res.send("not allowed")
  );
});

// Task 11

function getISBN(isbn) {
  let book = books[isbn];
  return new Promise((resolve, reject) => {
    if (book) {
      resolve(book);
    } else {
      reject("Unable to find book!");
    }
  })
}

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  getISBN(isbn).then(
    (bk) => res.send(JSON.stringify(bk, null, 4)),
    (error) => res.send(error)
  )
});

//12
//13
module.exports.general = public_users;
