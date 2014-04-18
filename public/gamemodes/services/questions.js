'use strict';

angular.module('karttapp.gamemodes').factory('Question', ['$resource', function($resource) {
  return $resource('game/connect/:groupid',{
    groupid: '@groupid'
  })
}]);
