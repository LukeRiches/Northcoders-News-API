const db = require("../connection");

function fetchArticleByID(article_id){
    let query = "SELECT * FROM articles WHERE article_id = $1;"

    return db.query(query, [article_id]).then(({rows}) => {
        if (rows[0] === undefined) {
            return Promise.reject({
                status: 404, 
                msg : "Article does not exist"
            })
        } else {
            return rows[0];
        }
    })
}

function fetchCommentsByID(article_id){
    let query = "SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at;"

    return db.query(query, [article_id]).then(({rows}) => {
        if (rows[0] === undefined) {
            return Promise.reject({
                status: 404, 
                msg : "Article has no comments"
            })
        } else {
            return rows;
        }
    })
}


module.exports = {fetchArticleByID, fetchCommentsByID};