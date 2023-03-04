const db = require('../models');
const bcrypt = require('bcrypt');

const User = db.User;

exports.create = (req, res) => {
    // validate
    if(!req.body){
        res.status(400).send({message: 'Body cannot be empty'});
    }

    // bcrypt package to hash the password
    bcrypt.hash(req.body.password, 10)
  .then(hash => {
    const user = {
        first_name: req.body.firstName,
        last_name: req.body.lastName,
        username: req.body.username,
        img_url: '/img/default_profile_picture.jpg',
        email: req.body.email,
        password: hash
    };

    User.create(user)
    .then(user => {
        // here is what happen when the user is successfully created
        // Todo
        // instead of this line, redirect the user to the login page
        res.status(200).send({user: user.toJSON()});
    })
    .catch(err => {
        res.status(500).send({message: `Error while creating user: ${err}`});
    });
});
}

exports.tryLogin = (req, res) => {

    // if the session has a boolean named (auth), then the user is authenticated
    if(req.session.auth){
        res.send('You are already Login');
    }else{ // only if the user is not authenticated, try to authenticate him
        const email = req.body.email;
        const password = req.body.password;
    
        // find the user with the giving email
        User.findOne({where : {email: email}})
        .then(user => {
            if(!user){ // the user is not found
                res.status(404).send({message: 'User not found'});
            }else{
                // if the user is found, we compare the giving password with the stored password 
                // for that user using bcrypt package because we used it to hash the password
                bcrypt.compare(password, user.password)
                .then(result => {
                    if(result){
                        // create a session for the user
                        req.session.auth = true;
                        req.session.user = user;
                        res.status(200).send({message: 'User login was successful!, user: ' + req.session.user.user_id + ', ' +req.session.user.first_name + ', ' + req.session.user.last_name});
                    }else{
                        res.status(401).send({message: 'Wrong password'});
                    }
                })
            }
        })
        .catch(err => {
            res.status(500).send({message: 'Error while try to login: ' + err})
        })
    }

    
}