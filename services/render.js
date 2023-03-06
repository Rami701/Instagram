const axios = require('axios');

exports.homeRoute = (req, res) => {
    if(!req.session.auth){
        // Todo
        // render the login page
    }else{
        // call GET /posts
        axios.get('http://localhost:3000/posts')
        .then(result => {
            res.render('home', {posts: result});
        })
        .catch(err => {
            res.send(err);
        })
    }
}