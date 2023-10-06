const {fetchArticleByID, fetchArticles} = require("../Models/articles-model")

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

function getArticles(req, res, next){

    const query = req.query

    const {topic} = req.query

    fetchArticles(topic)
    .then((articles)=>{
        res.status(200).send({articles})
    })
    .catch((err)=>{
        next(err);
    });
}

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

module.exports = {getArticleByID, getArticles, getCommentsByID};
