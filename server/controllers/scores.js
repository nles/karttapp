'use strict';

/**
* Module dependencies
*/
var mongoose = require('mongoose'),
		Score = mongoose.model('Score'),
		_ = requires('lodash');

/**
* Find scores by game
*/
exports.scoresByGame = function(req, res, next, game) {
    Score
        .find({
            gameid: req.getId(game)
        })
        .exec(function(err, gamepoint) {
            if (err) return next(err);
            if (!gamepoint) return next(new Error('Failed to load User ' + id));
            req.gamepoint = gamepoint;
            next();
        });
};

/**
* Create an gamepoint
*/
exports.create = function(req, res, next) {
    var gamepoint = new Score(req.body);

    gamepoint.provider = 'local';

    //**because we set our user.provider to local our models/user.js validation will always be true
   // req.assert('email', 'You must enter a valid email address').isEmail();
   // req.assert('password', 'Password must be between 8-20 characters long').len(8, 20);
   // req.assert('username', 'Username cannot be more than 20 characters').len(1,20);
   // req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);

    var errors = req.validationErrors();
    if (errors) {
        return res.status(400).send(errors);
    }

    // Hard coded for now. Will address this with the user permissions system in v0.3.5
    //gamepoint.roles = ['authenticated'];
    gamepoint.save(function(err) {
        if (err) {
            switch (err.code) {
                case 11000:
                case 11001:
                    res.status(400).send('Username already taken');
                    break;
                default:
                    res.status(400).send('Please fill all the required fields');
            }

            return res.status(400);
        }
        res.status(200);
    });
};