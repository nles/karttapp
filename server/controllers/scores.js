'use strict';

/**
* Module dependencies
*/
var mongoose = require('mongoose'),
		Score = mongoose.model('Score');

/**
* Find scores by gameid
*/
exports.score = function(req, res, next, gameid) {
    Score.load(gameid, function(err, score) {
        if (err) return next(err);
        if (!score) return next(new Error('Failed to load score ' + gameid));
        req.score = score;
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
            switch (err.code) {
                case 11000:
                case 11001:
                    res.status(400).send('Please fill all the required fields');
                    break;
                default:
                    res.status(400).send('Please fill all the required fields');
            }

            return res.status(400);
        }else{
            res.jsonp(score);
        }
    });
};

/**
*
* List of scores
*/
exports.all = function(req,res,next,id){
    Score.find({gameid: id}).exec(function(err,users){
        if(err) return next(err);
        if(!users) return next(new Error('Failed to load scores'));
        req.scores = scores;
        next();
    })

}