const db = require('../models');
const bcrypt = require('bcrypt');

const User = db.User;

exports.create = (req, res) => {
    // validate
    if(!req.body){
        res.status(400).send({message: 'Body cannot be empty'});
    }

    const email = req.body.email;
    const username = req.body.username;

    // se if the giving email is taken by another user by making a query to find a user with the giving email
    User.findOne({where : {email: email}})
    .then(user => {
        if(!user){
            // if the giving email is not already taken by another user, check if the username is already taken
            User.findOne({where : {username: username}})
            .then(user2 => {
                if(!user2){
                    // nether the email nor the username is already taken by another user, so try to create the new user
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
                }else{
                    // The username is already taken by another user
                    // Todo
                    // - refresh tha login page and send a variable to be used to indicate the user that the username is taken,
                    //   by the UI
                    res.send({message: `The username: ${username} is already taken by another user`})
                }
            })
            .catch(err => {
                res.status(500).send({message: 'Error while getting data: ' + err})
            })
        }else{
            // the giving email is already taken by another user
            // Todo 
            // - refresh tha login page and send a variable to be used to indicate the user that the email is taken,
            //   by the UI 
            res.send({message: `The email: ${email} is already taken by another user`})
        }
    })
    .catch(err => {
        res.status(500).send({message: 'Error while getting data: ' + err})
    })
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