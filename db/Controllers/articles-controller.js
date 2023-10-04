const {fetchArticleByID, fetchCommentsByID} = require("../Models/articles-model");

function getArticleByID(req, res, next){
    // console.log("in controller");
    const { article_id } = req.params;

    fetchArticleByID(article_id)
    .then((article)=>{
        res.status(200).send(article)
    })
    .catch((err)=>{
        next(err);
    });
}

function getCommentsByID(req, res, next) {
    const { article_id } = req.params;

    // Promise.all([fetchArticleByID(article_id), fetchCommentsByID(article_id)])
    // .then((comments)=>{

    //     res.status(200).send(comments)
    // })
    // .catch((err)=>{
    //     next(err);
    // });

    fetchArticleByID(article_id)
    .then(()=>{
        fetchCommentsByID(article_id)
        .then((comments)=>{
            console.log(comments);
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

module.exports = {getArticleByID, getCommentsByID};

