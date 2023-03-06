const db = require('../models');
const Post = db.Post;
const Following = db.Following;

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

exports.getSomePosts = (req, res) => {
    // this API is going to be invoked when a user enters his home page
    // in the home page we want to show some posts to the user
    // the posts are posts from other users that the active user follows
    // -------------------------------------------------------------------
    
    // this is the limit of how many posts we want to get from each user
    const limit = 5;

    if(!req.session.auth){
        console.log('i am here22222')
        res.redirect('/');
    }else{
        const user_id = req.session.user.user_id;
        let ids = []; // this array is going to hold the ids of users that the active user follows

        // get all users that the active user follows
        Following.findAll({where: {follower_id: user_id}})
        .then(rows => {
            for(let i = 0; i < rows.length; i++){
                ids.push(rows[i].user_id); 
            }
            const postPromises = ids.map(id => { // create a promise for each id
                return Post.findAll({ // this query will be executed for each id 
                    where: {user_id: id},
                    limit: limit,
                })
            })
            Promise.all(postPromises) // to execute all queries
            .then(posts => {
                const flattenedPosts = [].concat(...posts);
                const shuffledPosts = flattenedPosts.sort(() => Math.random() - 0.5); // shuffle the posts randomly
                res.render('home', {posts: shuffledPosts});
            })
            .catch(err => {
                res.status(500).send({message: 'Error while getting posts: ' + err});
            })
        })
        .catch(err => {
            res.status(500).send({message: 'Error while getting following: ' + err});
        })
    }
}