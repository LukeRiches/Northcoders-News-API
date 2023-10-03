const api = require("../api.json")

function getApi(req, res, next){
    console.log(api, "api in controller");
    res.status(200).send(api)
}

module.exports = {getApi};