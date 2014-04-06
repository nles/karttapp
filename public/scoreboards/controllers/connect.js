'use strict';

angular.module('karttapp.scoreboards')
.controller('ConnectScoreController', ['$scope','$rootScope','Scoreboard',function($scope,$rootScope,Scoreboard){
	//id vai nimi?
	$rootScope.gameMode = '1';
	// jos gamemode nimi - ei pageHeader tarvi erikseen 'connect'
	$scope.pageHeader = 'Scoreboard - connect';

	$scope.findScores = function(gameid){
		Scoreboard.query(function(scores){
			$scope.scores = scores;
		})
	}

  $scope.findScores()

}]);
