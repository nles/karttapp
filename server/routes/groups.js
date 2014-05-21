'use strict';

var groups = require('../controllers/groups');
/**
* link methods and url-routes
*/
module.exports = function(app){
	//get all questiongroups
	app.get('/questions', groups.all);
	//create new questiongroup
	app.post('/saveGroup', groups.create);
	//update questiongroups attribute 'likes'
	app.post('/updateGroup', groups.update)
	//get all questiongroups
	app.get('/game/connect', groups.all);
}
