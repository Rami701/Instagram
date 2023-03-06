const db = require('../models');

const Following = db.Following;
const User = db.User;

exports.create = (req, res) => {
    if(req.session.auth){
        const follower_id = req.session.user.user_id;
        const user_id = req.body.user_id;

        // check if the user to be followed exist
        User.findOne({where: {user_id: req.body.user_id}})
        .then(user => {
            if(!user){
                res.status(404).send({message: 'User not found'});
            }else{
                const following = {
                    follower_id: follower_id,
                    user_id: user_id,
                }
        
                Following.create(following)
                .then(following => {
                    res.status(200).send({message: `User: ${follower_id} just followed User: ${user_id}`});
                })
                .catch(err => {
                    res.status(500).send({message: `Error while following user: ${err}`});
                })
            }
            
        })
        .catch(err => {
            res.status(500).send({message: 'Error while following user: ' + err});
        })
        
    }else{
        res.redirect('/login');
    }
}

exports.delete = (req, res) => {
    if(req.session.auth){
        const follower_id = req.session.user.user_id;
        const user_id = req.body.user_id;
    
        Following.destroy({where: {follower_id: follower_id, user_id: user_id}})
        .then(() => {
            res.status(200).send({message: 'User un-followed successfully'});
            // Todo
            // refresh the page
        })
        .catch(err => {
            res.status(500).send({message: 'Error while un-following user: ' + err});
        })
    }else{
        res.redirect('/login');
    }
}