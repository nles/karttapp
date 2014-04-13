'use strict';

angular.module('karttapp.scoreboards').factory('Scoreboard', ['$resource', function($resource) {
  return $resource('scoreboard/:gameid', {
    gameid: '@gameid'
  });
}]);
