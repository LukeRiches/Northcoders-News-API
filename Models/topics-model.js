const db = require("../db/connection");

function fetchTopics(){

    let query = "SELECT * FROM topics;"

    return db.query(query).then(({rows}) => {
        return rows;
    })
}

function fetchTopic(topic){

    let query = "SELECT * FROM topics WHERE slug = $1;"

    return db.query(query,[topic]).then(({rows}) => {
        const topic = rows[0];
        if (topic === undefined) {
            return Promise.reject({
                status: 200, 
                msg : "Topic does exist but has no comments"
            })
        } else {
            return rows;
        }
    })
}

module.exports = {fetchTopics, fetchTopic};
