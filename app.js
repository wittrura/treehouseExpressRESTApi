'use strict';

var express = require('express');
var app = express();

const PORT = process.env.PORT || 3000;

app.use(function(req, res, next){
  req.myMessage = "Hello, middleware #2";
  next();
});

app.use(function(req, res, next){
  console.log(req.myMessage);
  next();
});

app.use(function(req, res,next){
  console.log("third piece of middleware");
  next();
});

app.get('/', function(req, res){
   res.send('Hello world!');
});

app.listen(PORT, function(){
  console.log('Listening on port ' + PORT);
});
