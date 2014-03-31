'use strict';

angular.module('karttapp.system')
.factory('Menus', ['$resource', function($resource) {
  return $resource('admin/menu/:name', {
    name: '@name'
  });
}]);
