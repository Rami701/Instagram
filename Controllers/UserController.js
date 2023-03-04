const db = require('../models');
const bcrypt = require('bcrypt');

const User = db.User;

exports.create = (req, res) => {
    // validate
    if(!req.body){
        res.status(400).send({message: 'Body cannot be empty'});
    }

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