'use strict';

var mean = require('meanio');
/**
* Get navigation menu
*/
module.exports = function(app) {
	//define navigation menu
	app.get('/admin/menu/:name',function(req, res) {
  	var menu = req.params.name ? req.params.name : 'main';
    var items = mean.menus.get({
      menu: menu
    });

    res.jsonp(items);
  });
};