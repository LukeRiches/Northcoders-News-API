const { getApi } = require('./api-controller');
const {getArticleByID, getArticles, patchArticleVotes, postArticle} = require('./articles-controller');
const { getCommentsByID, postComment, deleteComment, patchCommentVotes } = require('./comments-controller');
const { getTopics } = require('./topics-controller');
const { getUsers, getUser } = require('./users-controller');

module.exports = {getTopics, getApi, getArticleByID, getArticles, getCommentsByID, postComment, getUsers, getUser, patchArticleVotes, deleteComment, patchCommentVotes, postArticle}
