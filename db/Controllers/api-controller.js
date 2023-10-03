const api = require("../../endpoints.json")

function getApi(req, res, next){
    res.status(200).send({endpoints : api})
}

module.exports = {getApi};