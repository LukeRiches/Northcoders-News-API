const {fetchArticleByID, fetchArticles} = require("../Models/articles-model");
const { fetchTopic } = require("../Models/topics-model");

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

    if(topic){
        fetchTopic(topic)
        .then(()=>{
            return fetchArticles(topic)
        })
        .then((articles)=>{
            res.status(200).send({articles})
        })
        .catch((err)=>{
            next(err);
        });
    } else {
        fetchArticles(topic)
        .then((articles)=>{
            res.status(200).send({articles})
        })
        .catch((err)=>{
            next(err);
        });
    }

}

module.exports = {getArticleByID, getArticles};
