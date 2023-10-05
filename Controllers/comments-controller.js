const { fetchArticleByID} = require("../Models/articles-model");
const { fetchCommentsByID, insertComment } = require("../Models/comments-model");

function getCommentsByID(req, res, next) {
    const { article_id } = req.params;

    fetchArticleByID(article_id)
    .then(()=>{
        fetchCommentsByID(article_id)
        .then((comments)=>{
            res.status(200).send(comments)
        })
        .catch((err)=>{
            next(err);
        }); 
    })
    .catch((err)=>{
        next(err);
    });
}

function postComment(req, res, next){
    const newComment = req.body;

    const {article_id} = req.params;

    // insertComment(newComment, article_id)
    // .then((comment) => {
    //   res.status(201).send({comment})
    // })
    // .catch(next);

    fetchArticleByID(article_id)
    .then(()=>{
        insertComment(newComment, article_id)
        .then((comment) => {
            res.status(201).send({comment})
        })
        .catch(next);
    })
    .catch((err)=>{
        next(err);
    });
}


module.exports = {getCommentsByID, postComment};