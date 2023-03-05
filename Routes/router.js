const express = require("express");
const router = express.Router();
const userController = require('../Controllers/UserController');
const PostController = require('../Controllers/PostController');
const PostLikeController = require('../Controllers/PostLikeController');
const FollowingController = require('../Controllers/FollowingController');
const CommentController = require('../Controllers/CommentController');


// -------------------- Pages -----------------------------


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

// Register form route
// this route is going to show the register form to the user.
router.get('/register', (req, res) => {
    res.send('Here is where the register form will appear.')
});

// ----------------------------------------------------------


// ------------------------ APIs ----------------------------

// Login route
// this route will handle a post request with a body that has two values:
// 1- email
// 2- password
// the email and password are the input from the user in the login form
// if the user entered a correct information, he will be redirected to his home page (GET /)
router.post('/login', userController.tryLogin);

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

// Delete post route
// this route is invoked when a user tries to delete one of his posts
// the post_id is taken form a hidden input
router.delete('/posts', PostController.delete);

// new post like route
// this route is going to be invoked when the user likes a post
// to insert a new post like to the database we need 2 values:
// 1- user_id: the id of the user who liked the post, we can get it from the session
// 2- post_id: the id of the liked post, we will get it from the body of the request,
//    by adding a hidden input for every post that contains the post id (dynamic)
router.post('/post-like', PostLikeController.create);

// un-Like a post
// this route is going to be invoked when the user un-like a post
// the user_id is taken from the session
// the post_id is taken from a hidden input
router.delete('/post-like', PostLikeController.delete);

// follower route
// this route is going to be invoked when a user tries to follow another user
// a row will be added to the following table
// the follower_id is taken from the session
// the user_id (the user who is being followed) is going to be in the request body as hidden input attached to the user profile dynamically
router.post('/follow', FollowingController.create);


// un-follow route
// this route is going to be invoked when the user tries to un-follow a user
// the route will delete the row with follower_id = user_id in the session and user_id taken from a hidden input
router.delete('/follow', FollowingController.delete);


// create comment route
// this route is going to be invoked when a user tries to add a comment on a post
// we need 3 values:
// 1- user_id: id of the commenter, taken from the session
// 2- post_id: id of the post which being commented on, taken from a hidden input
// 3- caption: the comment it self, taken from the request body
router.post('/comments', CommentController.create);


// delete comment route
// this route is going to delete a comment 
// if the active user id is same as the comment author id, the comment will be deleted
router.delete('/comments', CommentController.delete);



module.exports = router;