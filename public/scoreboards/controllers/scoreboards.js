'use strict';

angular.module('karttapp.scoreboards')
.controller('ScoreboardController', ['$scope', '$stateParams', '$location', 'Global', 'Scoreboard' , function ($scope, $stateParams, $location, Global, Scoreboard) {

  $scope.global = Global;
  
  $scope.findScores = function(gameid){
		Scoreboard.query(function(scores){
			$scope.scores = scores;
		})
	}

	$scope.findScores(1);

}]);