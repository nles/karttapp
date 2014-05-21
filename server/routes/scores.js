'use strict';

var scores = require('../controllers/scores');
/**
* link methods and url-routes
*/
module.exports = function(app){
	//create new score
	app.post('/saveScore',scores.create);
	//get score(s) by given gameid
	app.get('/scoreboard/:gameid', scores.show)
	//get all scores
	app.get('/scoreboard', scores.all);
	//get score(s) by given gameid
	app.param('gameid',scores.scores);
}
