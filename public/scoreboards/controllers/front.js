'use strict';

angular.module('karttapp.scoreboards')
.controller('ScoreboardFrontCtrl', ['$scope', '$stateParams', '$location', 'Global', 'Scoreboard' , function ($scope, $stateParams, $location, Global, Scoreboard) {

  $scope.global = Global;
  
}]);