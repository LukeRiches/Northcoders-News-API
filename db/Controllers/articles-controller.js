const {fetchArticleByID} = require("../Models/articles-model")

function getArticleByID(req, res, next){
    // console.log("in controller");
    const { article_id } = req.params;
    // console.log(article_id, "<< :article_id");

    fetchArticleByID(article_id)
    .then((article)=>{
        // console.log(article, "article")
        res.status(200).send(article)
    })
    .catch((err)=>{
        next(err);
    });
}

module.exports = getArticleByID;