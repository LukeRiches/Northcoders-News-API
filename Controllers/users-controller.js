const { fetchUsers, fetchUser } = require("../Models/users-model");

function getUsers(req, res, next){

    if(Object.keys(req.query).length >= 1){
        return res.status(400).send({msg : "No queries have been declared yet"})
    }

    fetchUsers()
    .then((users)=>{
        res.status(200).send({users})
    })
    .catch((err)=>{
        next(err);
    });
}

function getUser(req, res, next){
    const { username } = req.params;

    fetchUser(username)
    .then((article)=>{
        res.status(200).send(article)
    })
    .catch((err)=>{
        next(err);
    });
}

module.exports = {getUsers, getUser};