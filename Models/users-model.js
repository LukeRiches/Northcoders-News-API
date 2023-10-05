const db = require("../db/connection");


function fetchUsers(){
    let query = `
    SELECT * FROM users;
    `;

    return db.query(query).then(({rows}) => {
        return rows;
    })
}

function fetchUser(username){
    let query = "SELECT * FROM users WHERE username = $1;"

    return db.query(query, [username]).then(({rows}) => {
        const article = rows[0];
        if (rows[0] === undefined) {
            return Promise.reject({
                status: 404, 
                msg : "User does not exist"
            })
        } else {
            return article;
        }
    })
}

module.exports = {fetchUsers, fetchUser}