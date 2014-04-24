'use strict';

angular.module('karttapp.gamemodes')
.controller('FlaggerController', ['$scope', '$rootScope', '$http', '$location', 'GameMode', function ($scope, $rootScope, $http, $location, GameMode) {
  $scope.score = {};
  // pelimoodin id tietokantaa varten
  //connect-pelin kysymysten lisäysmahdollisuuden vuoksi id:n oltava suuri
  $rootScope.gameMode = 2;
  // pelimoodin nimi
  $scope.pageHeader = "Flagger";
  // pisteiden alustus
  $scope.points = 0;
  // pistekerroin, joka kertyy putkeen vastatuista oikeista vastauksista.
  $scope.multiplier = 0;
  $scope.multiplierEffect = {0:'danger',1:'warning',2:'info',3:'success'}
  $scope.levelEffect = {1: 'success', 2: 'warning', 3: 'danger'}
  //
  $scope.flags = new Array();

  $scope.groups = [{name: "Easy",id: 1},{name: "Moderate",id: 2},{name: "Hard",id: 3}]
  $scope.groupid = 0;
  $scope.setGroupid = function(id){
    $scope.groupid = id;
    window.Flagger.startGame()
    //..
  }

  // estetään tilan vaihtaminen kesken pelin
  $scope.gameStarted = GameMode.gameStarted();
  $scope.startGame = function(){ GameMode.startGame(); }
  $scope.endGame = function(){ GameMode.endGame(); }

  // ajetaan "ulkoinen" koodi täältä controllerista (view ladattu)
  window.Flagger.init();

  $scope.submitScore = function(){
    $http.post('/saveScore', {
      player: $scope.score.player,
      gameid: $scope.score.gameid,
      points: $scope.score.points,
      groupid: $scope.groupid
    }).success(function(){
      $.magnificPopup.close();
      $scope.endGame();
      $location.url('/scoreboard/'+$scope.score.gameid);
    }).error(function(data,status){
      console.log("error "+status+" with "+data);
      $.magnificPopup.close();
      $scope.endGame();
      $location.url('/')
    });

  };

}]);
