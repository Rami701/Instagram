const db = require('../models');
const CommentLike = db.CommentLike;
const Comment = db.Comment;

exports.create = (req, res) => {
    if (req.session.auth) {
      const comment_id = req.body.comment_id;
      //check if the comment exist
      Comment.findOne({ where: { comment_id: comment_id } })
        .then(comment => {
          if (!comment) {
            res.status(404).send({ message: 'Comment not found' });
          } else {
            const commentLike = {
              comment_id: comment_id,
              user_id: req.session.user.user_id,
            }
            console.log('i am here');
            CommentLike.create(commentLike)
              .then(like => {
                res.status(200).json({ message: 'Comment liked successfully' });
              })
              .catch(err => {
                console.error(err);
                res.status(500).send({ message: 'Error while liking the comment: ' + err.message });
              })
          }
        })
        .catch(err => {
          console.error(err);
          res.status(500).send({ message: 'Error while finding comment: ' + err.message });
        })
    } else {
      // Todo
      // redirect the user to the login page 
      res.send({ message: 'You are not authenticated' });
    }
  }
  

exports.delete = (req, res) => {
    if(req.session.auth){
        const comment_id = req.body.comment_id;
        //check if the comment exist
        Comment.findOne({where: {comment_id: comment_id}})
        .then(comment => {
            if(!comment){
                res.status(404).send({message: 'Comment not found'});
            }else{
                CommentLike.destroy({where: {comment_id: comment_id, user_id: req.session.user.user_id}})
                .then(() => {
                    res.status(200).json({message: 'Comment un-Like'});
                })
                .catch(err => {
                    res.status(500).send({message: 'Error while un-liking the comment: ' + err});
                })
            }
        })
        .catch(err => {
            res.status(500).send({message: 'Error while un-liking the comment: ' + err});
        })
    }else{
        // Todo
        // redirect the user to the login page
        res.send({message: 'You are not authenticated'});
    }
}