'use strict';

var express = require('express');
var router = express.Router();
var Question = require('./models').Question;

router.param("qid", function(req, res, next, id){
  Question.findById(req.params.qid, function(err, doc){
    if (err) return next(err);
    if (!doc) {
      err = new Error("Not Found");
      err.status = 404;
      return next(err);
    }
    req.question = doc;
    return next();
  });
});

router.param("aid", function(req, res, next, id){
  req.answer = req.question.answers.id(id);
  if (!req.answer){
    err = new Error("Not Found");
    err.status = 404;
    return next(err);
  }
  next();
});

// GET /questions
// return all questions
router.get("/", function(req, res, next){
  Question.find({})
          .sort({createdAt: -1})
          .exec(function(err, questions){
            if (err) return next(err);
            res.json(questions);
          });
});

// POST /questions
// create new question document
router.post("/", function(req, res, next){
  var question = new Question(req.body);
  question.save(function(err, question){
    if (err) return next(err);
    res.status(201);
    res.json(question);
  });
});

// GET /questions/####
// get a question
router.get("/:qid", function(req, res, next){
  res.json(req.question);
});

// POST /questions/####/answers
// post answer to a question
router.post("/:qid/answers", function(req, res, next){
  req.question.answers.push(req.body);
  req.question.save(function(err, question){
    if (err) return next(err);
    res.status(201);
    res.json(question);
  });
});

// PUT /questions/####/aswers/####
// update answer to a question
router.put("/:qid/answers/:aid", function(req, res){
  req.answer.update(req.body, function(err, answer){
    if (err) return next(err);
    res.json(answer);
  });
});

// DELETE /questions/####/aswers/####
// delete answer to a question
router.delete("/:qid/answers/:aid", function(req, res){
  req.answer.remove(function(err){
    req.question.save(function(err, question){
      if (err) return next(err);
      res.json(question);
    });
  });
});

// POST /questions/####/answers/####/vote-xxxx
// post to an answer
router.post("/:qid/answers/:aid/vote-:dir", function(req, res, next){
  if(req.params.dir.search(/^(up|down)$/) === -1){
    var err = new Error("Not Found");
    err.status = 404;
    next(err);
  } else {
    req.vote = req.params.dir;
    next();
  }
}, function(req, res, next){
  req.answer.vote(req.vote, function(err, question){
    if (err) return next(err);
    res.json(question);
  });
});

module.exports = router;
