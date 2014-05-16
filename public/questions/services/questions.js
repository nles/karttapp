'use strict';
/**
* return country_data.json - file
*/
angular.module('karttapp.questions').factory('Countries', ['$http', function($http) {
  return $http.get('public/public/data/countries/country_data.json')
}]);