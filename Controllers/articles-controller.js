const {fetchArticleByID, fetchArticles, updateArticleVotes, getVotes} = require("../Models/articles-model");
const { fetchTopic } = require("../Models/topics-model");

function getArticleByID(req, res, next){
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

    const {topic, sort_by, order} = req.query

    if(topic){
        fetchTopic(topic)
        .then(()=>{
            return fetchArticles(topic, sort_by, order)
        })
        .then((articles)=>{
            res.status(200).send({articles})
        })
        .catch((err)=>{
            next(err);
        });
    } else {
        fetchArticles(topic, sort_by, order)
        .then((articles)=>{
            res.status(200).send({articles})
        })
        .catch((err)=>{
            next(err);
        });
    }

}

function patchArticleVotes (req, res, next){
    const {article_id} = req.params; 
    const {inc_votes} = req.body

    if(inc_votes === undefined){
        return res.status(400).send({msg:"inc_votes is required"})
    }

    fetchArticleByID(article_id)
    .then(()=>{
        return getVotes(article_id)
    })
    .then((response)=>{
        return response.votes
    })
    .then((current_votes)=>{
        return updateArticleVotes(article_id, inc_votes, current_votes)
    })
    .then((article)=>{
        res.status(200).send(article)
    })
    .catch((err)=>{
        next(err);
    });
}

module.exports = {getArticleByID, getArticles, patchArticleVotes};
