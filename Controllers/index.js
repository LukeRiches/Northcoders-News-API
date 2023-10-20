const { getApi } = require('./api-controller');
const {getArticleByID, getArticles, patchArticleVotes} = require('./articles-controller');
const { getCommentsByID, postComment } = require('./comments-controller');
const { getTopics } = require('./topics-controller');
const { getUsers, getUser } = require('./users-controller');

module.exports = {getTopics, getApi, getArticleByID, getArticles, getCommentsByID, postComment, getUsers, getUser, patchArticleVotes}
