const express = require("express");
const app = express();

const {getTopics} = require("./Controllers/controller");

app.get("/api/topics", getTopics);

//Path not found error
app.use((req, res) => {
    res.status(404).send({ msg: 'Path not found' })
});

//Error handling middleware functions 
// app.use((err, req, res, next) => {
//     // console.log("user error");
//     console.log(err, "err1")
//     if (err.status) {
//       res.status(err.status).send({ msg: err.msg });
//     } else next(err);
// });
  
// app.use((err, req, res, next) => {
//     console.log("psql user related error");
//     // console.log(err, "err2");
//     if(err.code === '' || err.code === ''){
//       res.status(400).send({msg : 'Bad request'});
//     } else next(err);
// });

//Internal system error if no catches are made
app.use((err, req, res, next) => {
    // console.log(err);
    res.status(500).send({ msg: 'Internal Server Error' });
});


module.exports = app;