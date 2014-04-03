'use strict';

angular.module('karttapp.scoreboards')
.controller('ConnectController', ['$scope','$rootScope','Scores',function($scope,$rootScope, Scores){
	//id vai nimi?
	$rootScope.gameMode = '1';
	// jos gamemode nimi - ei pageHeader tarvi erikseen 'connect'
	$scope.pageHeader = 'Scoreboard - connect';

	$scope.find = function(gameid){
		Scores.query(function(scores){
			$scope.scores = scores;
		})
	}
    
}]);