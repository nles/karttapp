'use strict';

var mean = require('meanio');

module.exports = function(app) {
		app.get('/admin/menu/:name',function(req, res) {
      var menu = req.params.name ? req.params.name : 'main';
      var items = mean.menus.get({
        menu: menu
      });

      res.jsonp(items);
	  });
};