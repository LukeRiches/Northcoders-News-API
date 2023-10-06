const { getApi } = require('./api-controller');
const {getArticleByID, getArticles, getCommentsByID} = require('./articles-controller');
const { getTopics } = require('./topics-controller');
const { getUsers, getUser } = require('./users-controller');
module.exports = {getTopics, getApi, getArticleByID, getArticles, getCommentsByID, getUsers, getUser}