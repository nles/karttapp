'use strict';

angular.module('karttapp.gamemodes')
.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

  // states for different game modes
  $stateProvider
  .state('connect', {
    url: '/game/connect',
    templateUrl: 'public/gamemodes/views/connect.html',
    controller: 'ConnectController'
  })
  .state('flagger', {
    url: '/game/flagger',
    templateUrl: 'public/gamemodes/views/flagger.html',
    controller: 'FlaggerController'
  });

}])
