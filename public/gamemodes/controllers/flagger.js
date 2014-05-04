'use strict';

angular.module('karttapp.gamemodes')
.controller('FlaggerController', ['$scope', '$rootScope', '$http', '$location', 'GameMode', function ($scope, $rootScope, $http, $location, GameMode) {
  $scope.score = {};
  // pelimoodin id tietokantaa varten
  $rootScope.gameMode = 2;
  // pelimoodin nimi
  $scope.pageHeader = "Flagger";
  // pisteiden alustus
  $scope.points = 0;
  // pistekerroin, joka kertyy putkeen vastatuista oikeista vastauksista.
  $scope.multiplier = 1;
  $scope.multiplierEffect = {0:'danger',1:'warning',2:'info',3:'success'}
  $scope.levelEffect = {1: 'success', 2: 'warning', 3: 'danger'}
  //
  $scope.flags = new Array();

  // estetään tilan vaihtaminen kesken pelin
  $scope.gameStarted = GameMode.gameStarted();
  $scope.startGame = function(){ GameMode.startGame(); }
  $scope.endGame = function(){ GameMode.endGame(); }

  // ajetaan "ulkoinen" koodi täältä controllerista (view ladattu)
  window.Flagger.init();

  $scope.submitScore = function(){
    $.magnificPopup.close();
    $http.post('/saveScore', {
      gameid: $rootScope.gameMode,
      player: $scope.score.player.toUpperCase(),
      points: $scope.score.points,
      groupid: $scope.score.groupid
    })
    .success(function(){
      $scope.endGame();
      $location.url('/scoreboard/'+$rootScope.gameMode);
    })
    .error(function(data,status){
      console.log("error "+status+" with "+data);
      $location.url('/scoreboard/'+$rootScope.gameMode);
    });

  };

}]);
