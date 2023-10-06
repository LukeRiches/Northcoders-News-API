const { getApi } = require('./api-controller');
const {getArticleByID, getArticles} = require('./articles-controller');
const { getCommentsByID, postComment } = require('./comments-controller');
const { getTopics } = require('./topics-controller');

module.exports = {getTopics, getApi, getArticleByID, getArticles, getCommentsByID, postComment,}
