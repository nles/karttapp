'use strict';

angular.module('karttapp.scoreboards')
.controller('ScoreboardController', ['$scope', '$stateParams', '$location', 'Global', 'Scoreboard' , function ($scope, $stateParams, $location, Global, Scoreboard) {

  $scope.global = Global;
  $scope.connectID = 1;
  $scope.flaggerID = 2;
  $scope.quantityOfScores = 10;
  $scope.tableTitle = "HALL OF FAME";
  $scope.tableSubTitle = ($stateParams.gameid == $scope.connectID)?'Connect':'Flagger';
  $scope.orderProp = "points";
  $scope.gameid = $stateParams.gameid;
  $scope.limit = function(items){
  	return items.slice(0,10)
  }
  $scope.findScores = function(){
    Scoreboard.query({
      gameid:$stateParams.gameid
    },function(scores){
      $scope.scores = scores;
    })
  }

}]);