'use strict';

angular.module('karttapp.gamemodes')
.controller('ConnectController', ['$scope', '$rootScope', '$http', function ($scope, $rootScope, $http) {

  // ns. virallinen nimi pelimoodille
  $rootScope.gameMode = 'connect'
  $scope.pageHeader = "Yhdistä maa ja asia";
  // kysymykset - haetaan ulkoisesta lähteestä:
  $http.get('/public/public/data/questions/cars.json').success(function(data) {
    $scope.questions = data.cars;
  });
  // ajetaan "ulkoinen" koodi täältä controllerista (view ladattu)
  window.initConnectGame();

}]);
