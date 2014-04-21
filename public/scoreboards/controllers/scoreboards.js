'use strict';

angular.module('karttapp.scoreboards')
.controller('ScoreboardController', ['$scope', '$stateParams', '$location', 'Global', 'Scoreboard', 'Group' , function ($scope, $stateParams, $location, Global, Scoreboard, Group) {

  $scope.global = Global;
  $scope.connectID = 1;
  $scope.flaggerID = 2;
  $scope.groupid = 0;
  $scope.quantityOfScores = 10;
  $scope.tableTitle = "HALL OF FAME";
  $scope.gameName = ($stateParams.gameid == $scope.connectID)?'Connect':'Flagger';
  $scope.orderProp = "points";
  $scope.gameid = $stateParams.gameid;
  $scope.limit = function(items){
  	return items.slice(0,10)
  }
  $scope.filterByGroup = function(){
    return function(item){
      if($scope.groupid == 0){
        return true
      }else{
        return item.groupid == $scope.groupid
      }
    }
  }
  $scope.nameOfGroup = function(groupid){
    for(var i = 0 ; i<$scope.groups.length ; i++){
      if($scope.groups[i].id == groupid){
        return $scope.groups[i].name
      }
    }
  }
  $scope.findScores = function(){
    Scoreboard.query({
      gameid:$stateParams.gameid
    },function(scores){
      $scope.scores = scores;
    })
    if($stateParams.gameid == 1){
      $scope.getGroups()  
    }
  }
  $scope.groups = {}
  $scope.getGroups = function(){
    Group.query(function(groups){
      $scope.groups = groups;
    })
  }
  $scope.switchGroup = function(){
    if($(this)[0].group.id){
      $scope.groupid = $(this)[0].group.id;
    }
  }
  $scope.resetGroup = function(){
    $scope.groupid = 0
  }
}]);