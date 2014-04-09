'use strict';

angular.module('karttapp.gamemodes')
.controller('ConnectController', ['$scope', '$rootScope', '$http', function ($scope, $rootScope, $http) {

  // pelimoodin id tietokantaa varten
  $rootScope.gameMode = 1;
  // pelimoodin nimi
  $scope.pageHeader = "Connect country & thing";
  // pisteiden alustus
  $scope.points = 0;
  // pistekerroin, joka kertyy putkeen vastatuista oikeista vastauksista.
  $scope.multiply = 0;
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
  // maakohtaiset tiedot
  $http.get('/public/public/data/countries/country_data.json').success(function(data) {
    $scope.country_data = data;
  });
  // ajetaan "ulkoinen" koodi täältä controllerista (view ladattu)
  window.initConnectGame();

  $scope.submitScore = function(){
    $http.post('/saveScore', {
      player: $scope.score.player,
      gameid: $scope.score.gameid,
      points: $scope.score.points
    })
    .success(function(){
      // authentication OK >> ohjaus scoreboard-sivulle..?
      $location.url('/');

    })};

}]);
