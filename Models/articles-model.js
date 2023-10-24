const { off } = require("../app");
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

function fetchArticlesLength(topic, sort_by, order){

    if(sort_by === undefined){
        sort_by = "created_at"
    }

    if(order === undefined){
        order = "desc"
    }

    const queryValues = [];

    let query = `SELECT articles.article_id, articles.title,  articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id)::int AS comment_count 
    FROM articles 
    LEFT JOIN comments 
    ON articles.article_id = comments.article_id `;

    if (topic) {
        queryValues.push(topic);
        query += `WHERE articles.topic = $1 `;
    } 

    query += `GROUP BY articles.article_id `;

    if (!['article_id', 'title', 'topic', "author", 'body',"created_at", "article_img_url", "votes"].includes(sort_by)) {
        return Promise.reject({ status: 400, msg: 'Invalid sort_by query' });
    } else {
        query += ` ORDER BY ${sort_by}`
    }

    if (!['asc', 'desc'].includes(order)) {
        return Promise.reject({ status: 400, msg: 'Invalid order query' });
    } else {
        query += ` ${order};`
    }

    return db.query(query, queryValues).then(({rows}) => {
        if(rows[0] === undefined && topic){
            return Promise.reject({status : 200, msg : "Topic does exist but there are no articles for it yet"})
        }
        return rows.length;
    })
}

function fetchArticles(topic, sort_by, order, limit, p,  queryLength){

    if(sort_by === undefined){
        sort_by = "created_at"
    }

    if(order === undefined){
        order = "desc"
    }

    if(limit === undefined){
        limit = 10
    }

    if(p === undefined /*|| p < 1 */){
        p = 1
    }

    const offsetIndication = p - 1

    const offset = offsetIndication * limit;

    const availablePages = Math.ceil(queryLength / limit);
    
    if( p > availablePages ){
        return Promise.reject({ status: 400, msg: 'Page given is not within the available pages range' });
    }

    if(offset > queryLength){
        return Promise.reject({ status: 400, msg: 'Offset exceeds the number of articles' });
    }

    if( p < 1 ){
        return Promise.reject({ status: 400, msg: 'Page cannot be below 1' });
    }

    if( limit < 1 ){
        return Promise.reject({ status: 400, msg: 'Limit cannot be below 1' });
    }

    const queryValues = [];

    let query = `SELECT articles.article_id, articles.title,  articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id)::int AS comment_count 
    FROM articles 
    LEFT JOIN comments 
    ON articles.article_id = comments.article_id `;

    if (topic) {
        queryValues.push(topic);
        query += `WHERE articles.topic = $1 `;
    } 

    query += `GROUP BY articles.article_id `;

    if (!['article_id', 'title', 'topic', "author", 'body',"created_at", "article_img_url", "votes"].includes(sort_by)) {
        return Promise.reject({ status: 400, msg: 'Invalid sort_by query' });
    } else {
        query += ` ORDER BY ${sort_by}`
    }

    if (!['asc', 'desc'].includes(order)) {
        return Promise.reject({ status: 400, msg: 'Invalid order query' });
    } else {
        query += ` ${order}`
    }

    query += ` OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY`;    

    return db.query(query, queryValues)
    .then(({rows}) => {
        if(rows[0] === undefined && topic){
            return Promise.reject({status : 200, msg : "Topic does exist but there are no articles for it yet"})
        }
        else if(rows[0] === undefined && p){
            return Promise.reject({status : 404, msg : "No Articles found"})
        }
        return rows;
    })
}

function fetchArticlesPagination(topic, sort_by, order, limit, p){
    return fetchArticlesLength(topic, sort_by, order)
    .then((queryLength)=>{
        return Promise.all([ fetchArticles(topic, sort_by, order, limit, p, queryLength), fetchArticlesLength(topic, sort_by, order)])
    })
    .then((values)=>{
        return {
            articles: values[0],
            total_count: values[1]
        }
    })
}


function insertArticle ({author, title, body, topic, article_img_url}){

    if(!title){
        return Promise.reject({ status: 400, msg: 'Title is required' });
    }

    if(!body){
        return Promise.reject({ status: 400, msg: 'Body is required' });
    }

    let query = `
    SELECT articles.article_id, articles.title,  articles.topic, articles.author, articles.body, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id)::int AS comment_count 
    FROM articles 
    LEFT JOIN comments 
    ON articles.article_id = comments.article_id 
    WHERE articles.article_id = $1
    GROUP BY articles.article_id;`;
    
    if (article_img_url) {
        return db
          .query(
            'INSERT INTO articles (title, topic, author, body, article_img_url) VALUES ($1, $2, $3, $4, $5) RETURNING *;',
            [title, topic, author, body, article_img_url]
          )
          .then(({rows}) => {
            return rows[0];
          })
          .then((article)=>{
            return article.article_id
          })
          .then((article_id) => {
            return db.query(query, [article_id]).then(({rows}) => {
                return rows[0];
            })
        })

    } else {
        return db
          .query(
            'INSERT INTO articles (title, topic, author, body) VALUES ($1, $2, $3, $4) RETURNING *;',
            [title, topic, author, body]
          )
          .then(({rows}) => {
            return rows[0];
          })
          .then((article)=>{
            return article.article_id
          })
          .then((article_id) => {
            return db.query(query, [article_id]).then(({rows}) => {
                return rows[0];
            })
        })
    }
};

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

module.exports = {fetchArticleByID, fetchArticles, updateArticleVotes, getVotes, insertArticle, fetchArticlesPagination};