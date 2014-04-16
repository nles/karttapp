'use strict';

angular.module('karttapp.questions').factory('Question', ['$http', function($http) {
  return $http.get('public/public/data/countries/country_data.json')
}]);