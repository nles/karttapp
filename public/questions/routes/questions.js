'use strict';

angular.module('karttapp.questions')
.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  // state for questions add - site
  $stateProvider
  .state('questions', {
    url: '/questions',
    templateUrl: 'public/questions/views/questions.html'
  });

}])