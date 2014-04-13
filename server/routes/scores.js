'use strict';

var scores = require('../controllers/scores');

module.exports = function(app){
	app.post('/saveScore',scores.create);
	app.get('/scoreboard/:gameid', scores.show)
	app.get('/scoreboard', scores.all);
	app.param('gameid',scores.scores);
}
