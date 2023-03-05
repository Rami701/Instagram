const db = require('../models');
const Post = db.Post;

// The method for creating a new post
exports.create = (req, res) => {

    if(!req.session.auth){
        // Todo
        // redirect the user to the login page
        res.send({message: 'You are not authenticated'})
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