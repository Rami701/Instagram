const express = require("express");
const router = express.Router();
const userController = require('../Controllers/UserController');

// Home Route
// if the user is not authenticated this route will return the login page (GET /login).
// if the user is authenticated the rout will return the home page for the user. 
router.get('/', (req, res) => {
    res.send('Hello World!');
});



// Login form route
// this route is going to show the login form to the user
router.get('/login', (req, res) => {
    res.send('Here is where the login form will appear.');
});

// Login route
// this route will handle a post request with a body that has two values:
// 1- email
// 2- password
// the email and password are the input from the user in the login form
// if the user entered a correct information, he will be redirected to his home page (GET /)
router.post('/login', userController.tryLogin);

// Register form route
// this route is going to show the register form to the user.
router.get('/register', (req, res) => {
    res.send('Here is where the register form will appear.')
});


// Register route
// this route is going to be invoked when a user tries to register to the app.
// the request will has a body with 5 values:
// 1- firstName
// 2- lastName
// 3- username
// 4- email
// 5- password
// if the values are valid, a new user will be added to the database with the giving values.
// lastly, the user will be redirected to the login form (GET /login)
router.post('/register', userController.create);


module.exports = router;