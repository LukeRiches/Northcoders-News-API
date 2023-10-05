const db = require("../db/connection");


function fetchCommentsByID(article_id){
    let query = "SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;"

    return db.query(query, [article_id]).then(({rows}) => {
        if (rows[0] === undefined) {
            return Promise.reject({
                status: 200, 
                msg : "Article does exist but has no comments"
            })
        } else {
            return rows;
        }
    })
}

module.exports = {fetchCommentsByID};