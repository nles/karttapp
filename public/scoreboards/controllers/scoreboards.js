'use strict';

angular.module('karttapp.scoreboards')
.controller('ScoreboardsController', ['$scope', '$stateParams', '$location', 'Global', function ($scope, $stateParams, $location, Global) {

  $scope.global = Global;
  // tässä olisi kaikille tulostauluille yhteisiä asioita...

}]);