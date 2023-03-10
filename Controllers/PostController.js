const db = require('../models');
const Post = db.Post;
const Following = db.Following;
const User = db.User;
const PostLike = db.PostLike;
const Comment = db.Comment;
const CommentLike = db.CommentLike;

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
            // get some posts from each user that the active user if following
            const postPromises = ids.map(id => { // create a promise for each id
                return Post.findAll({ // this query will be executed for each id 
                    where: {user_id: id},
                    limit: limit,
                })
            })
            Promise.all(postPromises) // to execute all queries
            .then(posts => {
                let postsIds = [];
                const flattenedPosts = [].concat(...posts);
                for(let i = 0; i < flattenedPosts.length; i++){
                    postsIds.push(flattenedPosts[i].post_id);
                }
                console.log(postsIds);
                // for each post, get the ids of the users who liked this post
                const likersIdsPromises = postsIds.map(id => {
                    return PostLike.findAll({where: {post_id: id}})
                })
                
                Promise.all(likersIdsPromises)
                .then(likers => {
                    let likersInfoPromises = []; 
                    for(let i = 0; i < likers.length; i++){
                        const likersInfoPromisesForPost = likers[i].map(like => {
                            return User.findOne({where: {user_id: like.user_id}})
                        });
                        likersInfoPromises.push(Promise.all(likersInfoPromisesForPost));
                    }
                    Promise.all(likersInfoPromises) 
                    .then(rows => {
                        let likersInfo = [];
                        for(let i = 0; i < rows.length; i++){
                            const flattenedRows = [].concat(...rows[i]);
                            let postLikersInfo = [];
                            for(let j = 0; j < flattenedRows.length; j++){
                                postLikersInfo.push({
                                    likerId: flattenedRows[j].dataValues.user_id,
                                    likerProfilePic: flattenedRows[j].dataValues.img_url,
                                    likerUsername: flattenedRows[j].dataValues.username,
                                })
                            }
                            likersInfo.push({
                                postId: postsIds[i], // add postId to the object
                                likers: postLikersInfo
                            });
                            
                        }
                        // res.send(likersInfo);
                        // get the poster information and associate each poster information with his post
                        const userPromises = flattenedPosts.map(post => {
                            return User.findOne({where: {user_id: post.user_id}});
                        });
                        
                        Promise.all(userPromises)
                        .then(users => {
                            const postInfo = [];
                            for (let i = 0; i < flattenedPosts.length; i++) {
                                const post = flattenedPosts[i];
                                const user = users[i];
                                postInfo.push({
                                    post_id: post.post_id,
                                    caption: post.caption,
                                    img_url: post.img_url,
                                    user_id: user.user_id,
                                    profileImg: user.img_url,
                                    username: user.username,
                                });
                            }
                            // add each likers array in likersInfo to the right post object in the postInfo array
                            for(let i = 0; i < likersInfo.length; i++){
                                for(let j = 0; j < postInfo.length; j++){
                                    if(likersInfo[i].postId == postInfo[j].post_id){
                                        postInfo[j].likers = likersInfo[i].likers;
                                    }
                                }
                            }
                            // res.send(postInfo);
                            // get all comments on the posts
                            const commentsPromises = flattenedPosts.map(post => {
                                return Comment.findAll({where: {post_id: post.post_id}});
                            })
                            Promise.all(commentsPromises)
                            .then(result => {
                                let comments = [];
                                let singlePostComments = [];
                                for(let i = 0; i < result.length; i++){
                                    for(let j = 0; j < result[i].length; j++){
                                        if(result[i]){
                                            let comment = {
                                                comment_id: result[i][j].comment_id,
                                                commenter_id: result[i][j].user_id,
                                                caption: result[i][j].caption,
                                            }
                                            singlePostComments.push(comment);
                                        }
                                    }
                                    if(result[i][0]){
                                        comments.push({
                                            post_id: result[i][0].post_id,
                                            comments: singlePostComments,
                                        })
                                        singlePostComments = [];  
                                    }
                                }
                                // res.json(comments);
                                // get the number of likes for each comment
                                let commentsLikesPromises = []; 
                                let commentsLikesCount = [];
                                comments.forEach((post) => {
                                    post.comments.forEach((comment) => {
                                        commentsLikesPromises.push(CommentLike.findAll({where: {comment_id: comment.comment_id}}));
                                    })
                                })
                                Promise.all(commentsLikesPromises)
                                .then(result => {
                                    result.forEach((comment) => {
                                        if(comment.length >= 1){
                                            commentsLikesCount.push({
                                                comment_id: comment[0].comment_id,
                                                likesCount: comment.length,
                                            })
                                        }
                                    })
                                    // res.send(commentsLikesCount);
                                    // move all comments from the comments array to the main array (postInfo)
                                    for(let i = 0; i < comments.length; i++){
                                        for(let j = 0; j < postInfo.length; j++){
                                            if(comments[i].post_id == postInfo[j].post_id){
                                                postInfo[j].comments = comments[i].comments;
                                            }
                                        }
                                    }
                                
                                    // move the comments likes count from commentsLikesCount array to the main array (postInfo)
                                    for(let i = 0; i < commentsLikesCount.length; i++){
                                        console.log('1')
                                        postInfo.forEach(post => {
                                            if(post.comments){
                                                post.comments.forEach(comment => {
                                                    if(commentsLikesCount[i].comment_id == comment.comment_id){
                                                        comment.likesCount = commentsLikesCount[i].likesCount;
                                                    }
                                                })
                                            }
                                        })
                                    }                 
                                    // res.send(postInfo);

                                    // get each commenter information (profile image and username)
                                    let commenterInfoPromises = [];
                                    postInfo.forEach(post => {
                                        if(post.comments){
                                            post.comments.forEach(comment => {
                                                const promise = User.findOne({where: {user_id: comment.commenter_id}})
                                                    .then(user => {
                                                        return {
                                                            commenterProfileImg: user.img_url,
                                                            commenterUsername: user.username,
                                                            comment_id: comment.comment_id,
                                                        };
                                                    });
                                                commenterInfoPromises.push(promise);
                                            })
                                        }
                                    })
                                    // adding the each commenter information to the main array
                                    Promise.all(commenterInfoPromises)
                                    .then(result => {
                                        result.forEach(commenterInfo => {
                                            postInfo.forEach(post => {
                                                if(post.comments){
                                                    post.comments.forEach(comment => {
                                                        if(commenterInfo.comment_id == comment.comment_id){
                                                            comment.commenterProfileImg = commenterInfo.commenterProfileImg;
                                                            comment.commenterUsername = commenterInfo.commenterUsername;
                                                        }
                                                    })
                                                }
                                            })
                                        })
                                        res.send(postInfo);
                                    })
                                    .catch(err => {
                                        res.status(500).send({message: 'Error while getting commenters information; ' + err});
                                    })
                                })
                                .catch(err => {
                                    res.status(500).send({message: 'Error while getting comments likes: ' + err});
                                })
                                
                            })
                            .catch(err => {
                                res.status(500).send({message: 'Error while getting comments: ' + err});
                            })
                        })
                        .catch(err => {
                            res.status(500).send({message: 'Error while getting users: ' + err});
                        });
                          
                    })
                    .catch(err => {
                        res.status(500).send({message: 'Error while getting likers info: ' + err});
                    })
                })
                .catch(err => {
                    res.status(500).send({message: 'Error while getting likers: ' + err});
                });
                
                
                
                
                
                // res.send(postsLikes);
                // res.send(ids);
                // res.render('home', {posts: shuffledPosts});
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

