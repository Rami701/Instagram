const db = require('../models');
const Comment = db.Comment;

exports.create = (req, res) => {
    if(req.session.auth){
        const comment = {
            user_id: req.session.user.user_id,
            post_id: req.body.post_id,
            caption: req.body.caption,
        }

        Comment.create(comment)
        .then(comment => {
            res.status(200).send({message: 'Comment: ' + comment});
        })
        .catch(err => {
            res.status(500).send({message: `Error while adding comment: ${err}`});
        })

    }else{
        // Todo
        // redirect the user to the login page
        res.send({message: 'You are not authenticated'});
    }
}

exports.delete = (req, res) => {
    const comment_id = req.body.comment_id;
    
    Comment.findOne({where: {comment_id: comment_id}})
    .then(comment => {
        if(comment.user_id != req.session.user.user_id){
            res.send({message: 'You are not authenticated to deleted this comment'});
        }else{
            Comment.destroy({where: {comment_id: comment_id}})
            .then(() => {
                res.status(200).send({message: 'Comment deleted successfully'});
            })
            .catch(err => {
                res.status(500).send({message: `Error while deleting comment: ${err}`});
            })
        }
    })
    .catch(err => {
        res.status(500).send({message: 'Comment not found: ' + err});
    })
}