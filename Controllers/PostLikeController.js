const db = require('../models');


const PostLike = db.PostLike;


exports.create = (req, res) => {

    if(req.session.auth){
        const post_id = req.body.post_id;
        const user_id = req.session.user.user_id;
    
        const like = {
            post_id: post_id,
            user_id: user_id,
        }
    
        PostLike.create(like)
        .then(like => {
            res.status(200).json({message: 'Post liked successfully: ' + 'user_id: ' + user_id + ', post_id: ' + post_id});
        })
        .catch(err => {
            // this code is going to run if a user tried to like a post that he already liked
            // so the like is going to be deleted
            PostLike.destroy({where : {post_id: post_id, user_id: user_id}});
            res.send('Post unlike');
        })
    }else{
        // Todo
        // redirect the user to the login page
        res.send({message: 'You are not authenticated'});
    }

    
}