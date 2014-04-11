'use strict';

angular.module('karttapp.scoreboards')
.controller('ScoreboardController', ['$scope', '$stateParams', '$location', 'Global', 'Scoreboard' , function ($scope, $stateParams, $location, Global, Scoreboard) {

  $scope.global = Global;
  $scope.orderProp = "points";
  $scope.reverse = function(items){
  		return items.slice().reverse();
  }
  $scope.findScores = function(){
		Scoreboard.query(function(scores){
			$scope.scores = scores;
		})
	}

}]);