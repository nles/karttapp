'use strict';

var scores = require('../controllers/scores');

module.exports = function(app){
	app.post('/saveScore',scores.create);
	app.get('/scoreboard/:gameid', scores.show)
	app.param('gameid',scores.score);
}
