'use strict';

angular.module('karttapp.questions')
.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  // states for different scoreboards
  $stateProvider
  .state('questions', {
    url: '/questions',
    templateUrl: 'public/questions/views/questions.html'
  });

}])