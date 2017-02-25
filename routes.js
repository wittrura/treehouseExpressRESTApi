'use strict';

var express = require('express');
var router = express.Router();


router.get("/", function(req, res){
  res.json({response: "received GET request at /questions"});
});

router.post("/", function(req, res){
  res.json({
    response: "received POST request at /questions",
    body: req.body
  });
});

router.get("/:qid", function(req, res){
  res.json({
    response: "received GET request at /questions for ID " + req.params.qid
  });
});

router.post("/:qid/answers", function(req, res){
  res.json({
    response: "recevied POST request to /answers",
    questionId: req.params.qid,
    body: req.body
  });
});

router.put("/:qid/answers/:aid", function(req, res){
  res.json({
    response: "recevied PUT request to /answers",
    questionId: req.params.qid,
    answerId: req.params.aid,
    body: req.body
  });
});

router.delete("/:qid/answers/:aid", function(req, res){
  res.json({
    response: "recevied DELETE request to /answers",
    questionId: req.params.qid,
    answerId: req.params.aid,
    body: req.body
  });
});

router.post("/:qid/answers/:aid/vote-:dir", function(req, res, next){
  if(req.params.dir.search(/^(up|down)$/) === -1){
    var err = new Error("Not Found");
    err.status = 404;
    next(err);
  } else {
    next();
  }
}, function(req, res){
  res.json({
    response: "recevied POST request to /answers for /vote-" + req.params.dir,
    questionId: req.params.qid,
    answerId: req.params.aid,
    voteDirection: req.params.dir,
    body: req.body
  });
});

module.exports = router;
