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
    // console.log(req.query, "req.querys");

    if(Object.keys(req.query).length >= 1){
        return res.status(400).send({msg : "No queries have been declared yet"})
    }

    fetchArticles()
    .then((articles)=>{
        res.status(200).send(articles)
    })
    .catch((err)=>{
        next(err);
    });
}

module.exports = {getArticleByID, getArticles};