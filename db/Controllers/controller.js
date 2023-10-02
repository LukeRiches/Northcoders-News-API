const {fetchTopics} = require("../Models/model");

function getTopics(req, res, next){
    // console.log("in getTopics");
    // const {} = req.query;

    fetchTopics()
    .then((topics)=>{
        res.status(200).send(topics)
    })
    .catch((err)=>{
        next(err);
    });
}

module.exports = {getTopics};