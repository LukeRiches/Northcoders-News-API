const db = require("../connection");

function fetchTopics(){
    // console.log("in fetchTopics");

    let query = "SELECT * FROM topics;"

    return db.query(query).then(({rows}) => {
        // console.log(rows);
        return rows;
    })
}

module.exports = {fetchTopics};
