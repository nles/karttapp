'use strict';
/**
* Service for getting questions by given groupid
*/
angular.module('karttapp.gamemodes').factory('Question', ['$resource', function($resource) {
  return $resource('game/connect/:groupid',{
    groupid: '@groupid'
  })
}]);
