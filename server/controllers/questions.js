'use strict';

/**
* Module dependencies
*/
var mongoose = require('mongoose'),
		Question = mongoose.model('Question');

/**
* Find questions by groupid
*/
exports.questions = function(req, res, next, groupid) {
  Question.load(groupid, function(err, questions) { 
    if (err) return next(err);
    if (!questions) return next(new Error('Failed to load questions with id: ' + groupid));
    req.questions = questions;
    next();
  });
};

/**
* Create a question
*/
exports.create = function(req, res, next) {
  var question = new Question(req.body);
  question.save(function(err) {
    if (err) {
      return res.status(400).send('Please fill all the required fields (error '+err+')');
    }else{
      res.jsonp(question);
    }
  });
};

/**
*
* Get all questions
*/
exports.all = function(req,res,next){
  Question.find().exec(function(err,questions){
    if(err){
      res.render('error',{
        status: 500
      });
    } else {
      res.jsonp(questions);
    }
  })

}
/*
* Show a question
*/
exports.show = function(req,res){
  res.jsonp(req.questions);
}