const { fetchArticleByID} = require("../Models/articles-model");
const { fetchCommentsByID, insertComment } = require("../Models/comments-model");
const { fetchUser } = require("../Models/users-model");

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
    const username = newComment.username;
    const {article_id} = req.params;

    const allowedBody = ["username", "body"];

    // console.log(Object.keys(newComment), "newComment keys");

    // if(Object.keys(newComment)!== allowedBody){
    //     res.status(400).send({msg : "Invalid request body"})
    // }

    // Couldn't do the above with a Promise.reject unsure why ^

    Promise.all([fetchArticleByID(article_id), fetchUser(username)])
    .then(() => {
        insertComment(newComment, article_id)
        .then((comment) => {
            res.status(201).send({comment})
        })
    })
    .catch((err)=>{
        // console.log(err, "err");
        next(err);
    });

}


module.exports = {getCommentsByID, postComment};