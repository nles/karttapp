'use strict';
var mean = require('meanio');

exports.render = function(req, res) {
	// Preparing angular modules list with dependencies
	var modules = []
    for (var name in mean.modules) {
        modules.push({
            name: name,
            module: 'karttapp.' + name,
            angularDependencies: mean.modules[name].angularDependencies
        });
    }
    res.render('index', {
        modules: modules
    });
};