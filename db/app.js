const express = require("express");
const app = express();

const {getTopics, getApi, getArticleByID, getCommentsByID} = require("./Controllers");

//Happy paths
app.get("/api/topics", getTopics);

app.get("/api", getApi);

app.get("/api/articles/:article_id", getArticleByID)

app.get('/api/articles/:article_id/comments', getCommentsByID);

//Path not found error
app.use((req, res) => {
    res.status(404).send({ msg: 'Path not found' })
});

//Error handling middleware functions 
app.use((err, req, res, next) => {
    //user error
    // console.log(err, "err1")
    if (err.status) {
      res.status(err.status).send({ msg: err.msg });
    } else next(err);
});
  
app.use((err, req, res, next) => {
    //psql user related error
    // console.log(err, "err2");
    if(err.code === '22P02'){
      res.status(400).send({msg : 'Bad request'});
    } else next(err);
});

//Internal system error if no catches are made
app.use((err, req, res, next) => {
    // console.log(err);
    res.status(500).send({ msg: 'Internal Server Error' });
});


module.exports = app;