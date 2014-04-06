'use strict';

var scores = require('../controllers/scores');

module.exports = function(app,passport){
	app.post('/saveScore',scores.create);
	//app.param('gameId',scores.scoreByGame);
}
