'use strict';

angular.module('karttapp.scoreboards')
.controller('ConnectController', ['$scope','$rootScope',function($scope,$rootScope){
	//id vai nimi?
	$rootScope.gameMode = 'connect';
	// jos gamemode nimi - ei pageHeader tarvi erikseen 'connect'
	$scope.pageHeader = 'Scoreboard - connect';
	$scope.saveScore = function(){
    $http.post('/scoreboards', {
      player: $scope.score.player,
      game: $scope.score.game,
      points: $scope.score.points
    })
    .success(function(){
      // authentication OK
      $location.url('/');

    })
}]);