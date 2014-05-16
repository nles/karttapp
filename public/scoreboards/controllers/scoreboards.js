'use strict';

angular.module('karttapp.scoreboards')
.controller('ScoreboardController', ['$scope', '$stateParams', '$location', 'Scoreboard', 'Group' , function ($scope, $stateParams, $location, Scoreboard, Group) {

  $scope.connectID = 1;
  $scope.flaggerID = 2;
  $scope.quantityOfScores = 10;
  $scope.tableTitle = "HALL OF FAME";
  $scope.gameName = ($stateParams.gameid == $scope.connectID)?'Connect':'Flagger';
  $scope.orderProp = "points";
  $scope.gameid = $stateParams.gameid;
  $scope.groupid = 0;
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
    if(!$scope.groups) return
    for(var i = 0; i < $scope.groups.length ; i++){
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
    if($stateParams.gameid == 2){
      $scope.groups = [
        { name: 'Europe', id: 150 },
        { name: 'Africa', id: 2 },
        { name: 'Asia', id: 142 },
        { name: 'Oceania', id: 9 },
        { name: 'Americas', id: 19 }
      ]
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
