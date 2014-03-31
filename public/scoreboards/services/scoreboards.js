'use strict';

angular.module('karttapp.scoreboards').factory('Scoreboard', ['$resource', function($resource) {
  return $resource('scoreboard/:modeId', {
    articleId: '@_id'
  }, {
    update: {
      method: 'PUT'
    }
  });
}]);
