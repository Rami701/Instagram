const db = require('../models');
const Post = db.Post;

// The method for creating a new post
exports.create = (req, res) => {

    if(!req.session.auth){
        res.redirect('/login');
    }else{
        if(!req.body){
            res.status(400).send({message: 'Body cannot be empty'});
        }
    
        // at first i will hardcode the img_url, but when i make the UI,
        // the img will be uploaded by the user
    
        // the following code is for constructing the img url for the uploaded img
        // const {image} = req.files;
    
        // if(!image){
        //     res.status(400).send({message: 'you must upload a photo'});
        // }
    
        // image.mv(__dirname + '/../assets/upload/' + image.name);
    
        const authorId = req.session.user.user_id;
    
        const post = {
            user_id: authorId,
            caption: req.body.caption,
            img_url: '/img/default_profile_pic.jpg', // note: this is the hardcoded value, we must replace it with the constructed img_url by the commented code above
        }
    
        Post.create(post)
        .then(post => {
            res.status(200).send({message: 'Post created successfully, caption: ' + post.caption + ', userId' + post.user_id});
        })
        .catch(err => {
            res.status(500).send({message: 'Error while creating post: ' + err});
        })
    }
}

exports.delete = (req, res) => {
    if(req.session.auth){
        const user_id = req.session.user.user_id;
        const post_id = req.body.post_id;

        // check if the post exist
        Post.findOne({where: {post_id: post_id}})
        .then(post => {
            if(!post){
                res.status(404).send({message: 'Post not found'});
            }else{
                if(post.user_id != user_id){ // check if the active user is the author of the post
                    res.status(401).send({message: 'You are not authenticated to delete this post'});
                }else{
                    Post.destroy({where: {post_id: post_id}})
                    .then(() => {
                        // Todo
                        // delete all likes, comments and comments likes for the deleted post
                        res.status(200).send({message: 'Post deleted successfully'});
                    })
                    .catch(err => {
                        res.status(500).send({message: 'Error while deleting post: ' + err});
                    })
                }
            }
        })
        .catch(err => {
            res.status(500).send({message: 'Error while deleting post: ' + err});
        })
    }else{
        res.redirect('/login');
    }
}