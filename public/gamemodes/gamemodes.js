'use strict';

angular.module('karttapp.gamemodes', [])
.filter('unsafe', function($sce) {
  return function(val) {
    return $sce.trustAsHtml(val);
  };
});
