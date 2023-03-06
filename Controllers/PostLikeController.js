const db = require('../models');


const PostLike = db.PostLike;
const Post = db.Post;


exports.create = (req, res) => {

    if(req.session.auth){
        const post_id = req.body.post_id;
        const user_id = req.session.user.user_id;
        
        // check if the post exist before liking it
        Post.findOne({where: {post_id: post_id}})
        .then(post => {
            if(post){
                const like = {
                    post_id: post_id,
                    user_id: user_id,
                }
            
                PostLike.create(like)
                .then(like => {
                    res.status(200).json({message: 'Post liked successfully: ' + 'user_id: ' + user_id + ', post_id: ' + post_id});
                })
                .catch(err => {
                    res.status(500).send({message: 'Error while liking the post: ' + err});
                })
            }else{
                res.status(404).send({message: 'Post not fount'});
            }
            
        })
        .catch(err => {
            res.status(500).send({message: 'Error while liking the post: ' + err});
        })
        
    }else{
        res.redirect('/login');
    }  
}

exports.delete = (req, res) => {

    if(req.session.auth){
        const post_id = req.body.post_id;
        const user_id = req.session.user.user_id;
    
        PostLike.destroy({where: {post_id: post_id, user_id: user_id}})
        .then(() => {
            res.send({message: 'Post unlike'});
        })
        .catch(err => {
            res.status(500).send({message: 'Error while un-liking the post: ' + err});
        })
    }else{
        res.redirect('/login');
    }
}