'use strict';

var scores = require('../controllers/scores');

module.exports = function(app,passport){
	app.post('/saveScore',scores.create);
	

	app.get('/scoreboard/:gameId', scores.show)


	app.param('gameId',scores.score);
}
