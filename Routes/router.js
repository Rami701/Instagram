const express = require("express");
const router = express.Router();
const userController = require('../Controllers/UserController');
const PostController = require('../Controllers/PostController');
const PostLikeController = require('../Controllers/PostLikeController');

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


// new post route
// this route is going to be invoked when the user try to make a new post
// the body will have 2 values:
// 1- caption: the caption for the post
// 2- an uploaded img
router.post('/posts', PostController.create);

// new post like route
// this route is going to be invoked when a the user likes a post
// to insert a new post like to the database we need 2 values:
// 1- user_id: the id of the user who liked the post, we can get it from the session
// 2- post_id: the id of the liked post, we will get it from the body of the request,
//    by adding a hidden input for every post that contains the post id (dynamic)
// if the user already liked that post before, the like will be deleted
// so this route is for liking and also un-liking posts
router.post('/post-like', PostLikeController.create);

module.exports = router;