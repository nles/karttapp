'use strict';

angular.module('karttapp.gamemodes').factory('GameMode', ['$resource', function($resource) {
  return $resource('gamemode/:modeId', {
    articleId: '@_id'
  }, {
    update: {
      method: 'PUT'
    }
  });
}]);
