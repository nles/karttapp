'use strict';

angular.module('karttapp.gamemodes')
.controller('GameModesController', ['$scope', '$stateParams', '$location', 'Global', function ($scope, $stateParams, $location, Global) {

  $scope.global = Global;
  // tässä olisi kaikille pelimoodeille yhteisiä asioita...

}]);
