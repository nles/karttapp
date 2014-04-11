'use strict';

angular.module('karttapp.scoreboards').factory('Scoreboard', ['$resource', function($resource) {
  //return { query: function(){ return null; } };
  // tämän olisi kaiketi tarkoitus hakea pisteet valitulle pelimoodille
  // mutta nyt ei ainakaan toimi koska ei löydy backendistä osoitetta /scoreboard
  // korvattu siis väliaikaisesti tyhjyydellä (yllä)
  return $resource('scoreboard/:gameid', {
    gameid: '@_id'
  }, {
    update: {
      method: 'PUT'
    }
  });
}]);
