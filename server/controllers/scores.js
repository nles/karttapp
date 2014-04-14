'use strict';

/**
* Module dependencies
*/
var mongoose = require('mongoose'),
		Score = mongoose.model('Score');

/**
* Find scores by gameid
*/
exports.scores = function(req, res, next, gameid) {
  Score.load(gameid, function(err, scores) { 
    if (err) return next(err);
    if (!scores) return next(new Error('Failed to load scores with id: ' + id));
    req.scores = scores;
    next();
  });
};

/**
* Create an gamepoint
*/
exports.create = function(req, res, next) {
  var score = new Score(req.body);
  score.save(function(err) {
    if (err) {
      return res.status(400).send('Please fill all the required fields (error '+err+')');
    }else{
      res.jsonp(score);
    }
  });
};

/**
*
* List of scores
*/
exports.all = function(req,res,next){
  Score.find().sort('points').exec(function(err,scores){
    if(err){
      res.render('error',{
        status: 500
      });
    } else {
      res.jsonp(scores);
    }
  })

}
/*
* Show a score
*/
exports.show = function(req,res){
  res.jsonp(req.scores);
}