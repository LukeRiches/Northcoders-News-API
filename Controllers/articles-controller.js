const {fetchArticleByID, fetchArticles, fetchCommentsByID} = require("../Models/articles-model")

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

    // function checkQuery(query){
    //     if(!query.hasOwnProperty("topic")){
    //         Promise.reject({
    //             status : 400, 
    //             msg : "Not a valid query"
    //         })
    //     }
    // }

    const {topic} = req.query

    // Promise.all([checkQuery(query)])
    // .then(() => {
    //    return fetchArticles(topic)
    // })
    // .then((articles) => {
    //     res.status(200).send({articles})
    // })
    // .catch((err)=>{
    //     next(err);
    // });

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