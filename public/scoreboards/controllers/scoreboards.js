'use strict';

angular.module('karttapp.scoreboards')
.controller('ScoreboardController', ['$scope', '$stateParams', '$location', 'Global', 'Scoreboard' , function ($scope, $stateParams, $location, Global, Scoreboard) {

  $scope.global = Global;

  $scope.tableTitle = "Hall-Of-Fame";
  $scope.tableSubTitle = "Pick one";
  $scope.orderProp = "points";
  $scope.gameid = 0;
  $scope.setGame = function(gameid){
  	switch(gameid){
  		case 1:
  			$scope.tableSubTitle = "Connect"
  			break
  		default:
  			$scope.tableSubTitle = "Pick one"

  	}
  	$scope.gameid = gameid;
  }
  $scope.limit = function(items){
  	return items.slice(0,10)
  }
  $scope.reverse = function(items){
  		return items.slice().reverse();
  }
  $scope.filterBy = function(item){
  	if(item.gameid === $scope.gameid){
  		return true
  	}else{
  		return false;
  	}
  }
  $scope.findScores = function(){
		Scoreboard.query(function(scores){
			$scope.scores = scores;
		})
	}

}]);