'use strict';

angular.module('karttapp.scoreboards')
.controller('ScoreboardController', ['$scope', '$stateParams', '$location', 'Global', 'Scoreboard', 'Group' , function ($scope, $stateParams, $location, Global, Scoreboard, Group) {

  $scope.global = Global;
  $scope.connectID = 1;
  $scope.flaggerID = 2;
  $scope.quantityOfScores = 10;
  $scope.tableTitle = "HALL OF FAME";
  $scope.gameName = ($stateParams.gameid == $scope.connectID)?'Connect':'Flagger';
  $scope.orderProp = "points";
  $scope.gameid = $stateParams.gameid;
  $scope.groups = [
    {
      name: 'Easy',
      id: 1
    },
    {
      name: 'Moderate',
      id: 2
    },
    {
      name: 'Hard',
      id: 3
    }
    
  ]
  $scope.limit = function(items){
  	return items.slice(0,10)
  }
  $scope.filter = function(){
    return function(item){
      if($scope.groupid){
        if($scope.groupid == 0){
          return true
        }else{
          return item.groupid == $scope.groupid
        }
      }else if($scope.levelid){
        if($scope.levelid == 0){
          return true
        }else{
          return item.groupid == $scope.levelid
        }
      }else{
        return true
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
  $scope.nameOfLevel = function(id){
    switch(id){
      case 1:
        return "Easy";
      case 2:
        return "Moderate";
      case 3:
        return "Hard";
      default:
        return "Unknown";
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
  $scope.switchLevel = function(){
    if($(this)[0].level.id){
      $scope.groupid = $(this)[0].level.id;
    }
  }
  $scope.resetGroup = function(){
    $scope.groupid = 0
  }
}]);