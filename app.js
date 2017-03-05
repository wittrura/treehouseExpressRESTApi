'use strict';
var express = require('express');
var app = express();

var routes = require('./routes');
var jsonParser = require('body-parser').json;
var logger = require('morgan');

const PORT = process.env.PORT || 3000;

app.use(logger('dev'));
app.use(jsonParser());


var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/qa');

var db = mongoose.connection;

db.on('error', function(err){
  console.error("connection error: ", err);
});

db.once('open', function(){
  console.log("connected to MongoDb");
});

// support for cross-origin resource sharing
app.use(function(req, res, next){
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, DELETE");
    return res.status(200).json({});
  }
  next();
});

app.use("/questions", routes);

// error catch
app.use(function(req, res, next){
  var err = new Error("Not found");
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next){
  console.error(err);
  res.status(err.status || 500);
  res.json({
    error: {message: err.message}
  });
});

app.listen(PORT, function(){
  console.log('Listening on port ' + PORT);
});
