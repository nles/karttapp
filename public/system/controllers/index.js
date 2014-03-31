'use strict';

angular.module('karttapp.system')
.controller('IndexController',['$scope','Global', function ($scope, Global) {

    $scope.global = Global;

}]);
