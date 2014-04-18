'use strict';

var groups = require('../controllers/groups');

module.exports = function(app){
	app.get('/questions', groups.all)
	app.post('/saveGroup', groups.create);
	//app.get('/game/connect/:qroupid', questions.show)
	app.get('/game/connect', groups.all);
	//app.param('groupid',questions.questions);
}
