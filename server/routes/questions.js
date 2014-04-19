'use strict';

var questions = require('../controllers/questions');

module.exports = function(app){
	app.post('/saveQuestion', questions.create);
	app.get('/game/connect/:groupid', questions.show)
	app.get('/questions', questions.all);
	app.param('groupid', questions.questions);
}
