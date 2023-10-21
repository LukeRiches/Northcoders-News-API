const db = require("../db/connection");

function fetchArticleByID(article_id){
    let query = `
    SELECT articles.author, articles.title, articles.article_id, articles.body, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id) AS comment_count 
    FROM articles 
    LEFT JOIN comments 
    ON articles.article_id = comments.article_id 
    WHERE articles.article_id = $1
    GROUP BY articles.article_id
    ORDER BY created_at;
    `

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

function fetchArticles(topic){

    const queryValues = [];

    let query = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id)::int AS comment_count 
    FROM articles 
    LEFT JOIN comments 
    ON articles.article_id = comments.article_id `;

    if (topic) {
        queryValues.push(topic);
        query += `WHERE articles.topic = $1 `;
    } 

    query += `GROUP BY articles.article_id `;

    query += `ORDER BY created_at DESC;`;

    return db.query(query, queryValues).then(({rows}) => {
        if(rows[0] === undefined && topic){
            return Promise.reject({status : 200, msg : "Topic does exist but there are no articles for it yet"})
        }
        return rows;
    })
}

function updateArticleVotes (article_id, inc_count, current_votes){

    const newVotes = current_votes += inc_count;

    return db.query(
        `
        UPDATE articles
        SET votes = $1
        WHERE article_id = $2
        RETURNING * 
        `,
        [newVotes, article_id]
    )
    .then(({rows})=>{
        return rows[0]
    })
}

function getVotes(article_id){
    return db.query(
        `
        SELECT votes 
        FROM articles 
        WHERE article_id = $1;
        `,
        [article_id]
    ).then(({rows})=>{
        return rows[0]
    })
}

module.exports = {fetchArticleByID, fetchArticles, updateArticleVotes, getVotes};