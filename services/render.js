const axios = require('axios');

exports.homeRoute = (req, res) => {
    if(!req.session.auth){
        res.redirect('/login');
    }else{
        res.redirect('/posts');
    }
}

exports.login = (req, res) => {
    if(req.session.auth){
        res.redirect('/');
    }else{
        res.render('login');
    }
}

exports.register = (req, res) => {
    if(req.session.auth){
        res.redirect('/');
    }else{
        res.render('register');
    }
}