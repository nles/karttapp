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

  $scope.saveScore = function(){
    $http.post('/saveScore', {
      player: $scope.score.player,
      game: $scope.score.game,
      points: $scope.score.points
    })
    .success(function(){
      // authentication OK >> ohjaus scoreboard-sivulle..?
      $location.url('/');

    })};

}]);
