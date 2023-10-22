const express = require("express");
const app = express();

const {getTopics, getApi, getArticleByID, getArticles, getCommentsByID, postComment, getUsers, getUser, patchArticleVotes, deleteComment, patchCommentVotes} = require("./Controllers");

app.use(express.json());

//Happy paths

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles)

app.get("/api/articles/:article_id", getArticleByID)

app.patch("/api/articles/:article_id", patchArticleVotes)

app.get('/api/articles/:article_id/comments', getCommentsByID);

app.post("/api/articles/:article_id/comments", postComment)

app.patch("/api/comments/:comment_id", patchCommentVotes)

app.delete("/api/comments/:comment_id", deleteComment)

app.get("/api/users", getUsers)

app.get("/api/users/:username", getUser)

//Path not found error
app.use((req, res) => {
    res.status(404).send({ msg: 'Path not found' })
});

//Error handling middleware functions 
app.use((err, req, res, next) => {
    //user error
    if (err.status) {
      res.status(err.status).send({ msg: err.msg });
    } else next(err);
});
  
app.use((err, req, res, next) => {
    //psql user related error
    if(err.code === '22P02' ){
      res.status(400).send({msg : 'Invalid text representation'});
    } else next(err);
});

app.use((err, req, res, next) => {
  //psql user related error
  if(err.code === '23503' ){
    res.status(404).send({msg : 'Foreign key violation'});
  } else next(err);
});

app.use((err, req, res, next) => {
  //psql user related error
  if(err.code === '23502' ){
    res.status(400).send({msg : 'Not null violation'});
  } else next(err);
});

app.use((err, req, res, next) => {
  //psql user related error
  if(err.code === '42703' ){
    res.status(404).send({msg : 'column does not exist'});
  } else next(err);
});



//Internal system error if no catches are made
app.use((err, req, res, next) => {
    // console.log(err);
    res.status(500).send({ msg: 'Internal Server Error' });
});


module.exports = app;