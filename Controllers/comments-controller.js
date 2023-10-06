const { fetchArticleByID} = require("../Models/articles-model");
const { fetchCommentsByID, insertComment } = require("../Models/comments-model");
const { fetchUser } = require("../Models/users-model");

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

    function bodyCheck(newComment){
        
        if (!newComment.hasOwnProperty("username") ||!newComment.hasOwnProperty("body") || Object.keys(newComment).length !== 2) {
            return  Promise.reject({
                status: 400, 
                msg : "Invalid request body"
            })
        }
    }

    Promise.all([fetchArticleByID(article_id), fetchUser(username), bodyCheck(newComment)])
    .then(() => {
       return  insertComment(newComment, article_id)
    })
    .then((comment) => {
        res.status(201).send({comment})
    })
    .catch((err)=>{
        next(err);
    });

}


module.exports = {getCommentsByID, postComment};