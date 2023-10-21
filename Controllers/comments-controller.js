const { fetchArticleByID} = require("../Models/articles-model");
const { fetchCommentsByID, insertComment, removeCommentById } = require("../Models/comments-model");

function getCommentsByID(req, res, next) {
    const { article_id } = req.params;

    fetchArticleByID(article_id)
    .then(()=>{
       return fetchCommentsByID(article_id)
    })
    .then((comments)=>{
        res.status(200).send(comments)
    })
    .catch((err)=>{
        next(err);
    });
}

function postComment(req, res, next){
    const newComment = req.body;
    const username = newComment.username;
    const {article_id} = req.params;

    insertComment(newComment, article_id)
    .then((comment) => {
        res.status(201).send({comment})
    })
    .catch((err)=>{
        next(err);
    });
}

function deleteComment(req, res, next){
    const {comment_id} = req.params;

    removeCommentById(comment_id).then(() => {
        res.status(204).send();
      })
      .catch((err)=>{
        next(err)
      });

}


module.exports = {getCommentsByID, postComment, deleteComment};