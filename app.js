'use strict';
var express = require('express');
var app = express();

var routes = require('./routes');
var jsonParser = require('body-parser').json;
var logger = require('morgan');

const PORT = process.env.PORT || 3000;

app.use(logger('dev'));

app.use(jsonParser());

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
