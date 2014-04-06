'use strict';

angular.module('karttapp.scoreboards')
.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

  // states for different scoreboards
  $stateProvider
  .state('scoreboard', {
    url: '/scoreboard',
    templateUrl: 'public/scoreboards/views/connect.html',
    controller: 'ConnectScoreController'
  });

}])
