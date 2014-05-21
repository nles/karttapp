'use strict';

module.exports = function(app) {
    
    // Home route
    //start program through this:
    var index = require('../controllers/index');
    app.get('/', index.render);

};
