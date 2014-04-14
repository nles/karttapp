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
  $scope.multiplier = 0;
  $scope.multiplierEffect = {0:'danger',1:'warning',2:'info',3:'success'}

  // estetään tilan vaihtaminen kesken pelin
  $scope.gameStarted = GameMode.gameStarted();
  $scope.startGame = function(){ GameMode.startGame(); }
  $scope.endGame = function(){ GameMode.endGame(); }

  // ajetaan "ulkoinen" koodi täältä controllerista (view ladattu)
  window.Flagger.init();

  $scope.submitScore = function(){
    $.magnificPopup.close();
    $http.post('/saveScore', {
      player: $scope.score.player,
      gameid: $scope.score.gameid,
      points: $scope.score.points
    })
    .success(function(){
      // tallennus OK >> ohjaus scoreboard-sivulle..?
      //sulje popup.
      $location.url('/scoreboard/'+$scope.score.gameid);
    })
    .error(function(data,status){
      console.log("error "+status+" with "+data);
    });

  };

}]);
