'use strict';

angular.module('karttapp.questions').factory('Question', ['$resource', function($resource) {
  return $resource('questions', {
    groupid: '@groupid'
  });
}]);