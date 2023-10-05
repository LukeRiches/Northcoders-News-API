const db = require("../db/connection");

function fetchTopics(){

    let query = "SELECT * FROM topics;"

    return db.query(query).then(({rows}) => {
        return rows;
    })
}

module.exports = {fetchTopics};
