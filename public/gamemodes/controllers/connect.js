'use strict';

angular.module('karttapp.gamemodes')
.controller('ConnectController', ['$scope', '$rootScope', '$http', '$location', 'GameMode', function ($scope, $rootScope, $http, $location, GameMode) {
  $scope.score = {};
  // pelimoodin id tietokantaa varten
  $rootScope.gameMode = 1;
  // pelimoodin nimi
  $scope.pageHeader = "Connect country & thing";
  // pisteiden alustus
  $scope.points = 0;
  // pistekerroin, joka kertyy putkeen vastatuista oikeista vastauksista.
  $scope.multiplier = 0;
  $scope.multiplierEffect = {0:'danger',1:'warning',2:'info',3:'success'}
  // kysymykset - haetaan ulkoisesta lähteestä:
  $scope.questions = {}
  $http.get('/public/public/data/questions/cars.json').success(function(data) {
    $scope.questions.cars = data.cars;
  });
  $http.get('/public/public/data/questions/breeds_of_dog.json').success(function(data) {
    $scope.questions.breeds_of_dog = data.breeds_of_dog;
  });
  $http.get('/public/public/data/questions/tech_companies.json').success(function(data) {
    $scope.questions.tech_companies = data.tech_companies;
  });

  // estetään tilan vaihtaminen kesken pelin
  $scope.gameStarted = GameMode.gameStarted();
  $scope.startGame = function(){ GameMode.startGame(); }
  $scope.endGame = function(){ GameMode.endGame(); }

  // ajetaan "ulkoinen" koodi täältä controllerista (view ladattu)
  window.Connect.init();

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
      $scope.endGame();
      $location.url('/scoreboard/'+$rootScope.gameMode);
    })
    .error(function(data,status){
      console.log("error "+status+" with "+data);
    });

  };

}]);
