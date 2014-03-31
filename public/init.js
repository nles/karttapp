'use strict';

angular.element(document).ready(function() {
    //Fixing facebook bug with redirect
    if (window.location.hash === '#_=_') window.location.hash = '#!';

    //Then init the app
    angular.bootstrap(document, ['karttapp']);

});

angular.module('karttapp', ['ngCookies', 'ngResource', 'ui.bootstrap', 'ui.router', 'karttapp.system', 'karttapp.gamemodes' ]);
