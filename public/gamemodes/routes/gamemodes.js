'use strict';

angular.module('karttapp.gamemodes')
.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

  // states for different game modes
  $stateProvider
  .state('connect', {
    url: '/game/connect',
    templateUrl: 'public/gamemodes/views/connect.html',
    controller: 'ConnectController'
  });

}])