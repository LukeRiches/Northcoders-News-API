const { getApi } = require('./api-controller');
const getArticleByID = require('./articles-controller');
const { getTopics } = require('./topics-controller');

module.exports = {getTopics, getApi, getArticleByID}