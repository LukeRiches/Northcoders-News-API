const db = require("../connection");

function fetchArticleByID(article_id){
    // console.log("in model");

    let query = "SELECT * FROM articles WHERE article_id = $1;"

    return db.query(query, [article_id]).then(({rows}) => {
        // console.log(rows);
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


module.exports = {fetchArticleByID};