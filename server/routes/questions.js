'use strict';

var questions = require('../controllers/questions');
/**
* link methods and url-routes
*/
module.exports = function(app){
	//create new question
	app.post('/saveQuestion', questions.create);
	//get questions by given id
	app.get('/game/connect/:groupid', questions.show)
	//get all questions
	app.get('/questions', questions.all);
	//get question(s) by groupid
	app.param('groupid', questions.questions);
}
