'use strict';

angular.module('karttapp.gamemodes', [])
.filter('unsafe', ['$sce', function($sce) {
  return function(val) {
    return $sce.trustAsHtml(val);
  };
}]);
