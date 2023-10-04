const db = require("../connection");

function fetchArticleByID(article_id){
    let query = "SELECT * FROM articles WHERE article_id = $1;"

    return db.query(query, [article_id]).then(({rows}) => {
        const article = rows[0];
        if (rows[0] === undefined) {
            return Promise.reject({
                status: 404, 
                msg : "Article does not exist"
            })
        } else {
            return article;
        }
    })
}

function fetchArticles(){
    let query = `
    SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, SUM(comments.article_id) AS comment_count 
    FROM articles 
    LEFT JOIN comments 
    ON articles.article_id = comments.article_id 
    GROUP BY articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url 
    ORDER BY created_at;
    `;

    return db.query(query).then(({rows}) => {
        const articles = rows
        console.log(rows, "rows")
        return {articles};
    })
}




module.exports = {fetchArticleByID, fetchArticles};