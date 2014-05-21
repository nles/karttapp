'use strict';

angular.module('karttapp.scoreboards')
.controller('ScoreboardController', ['$scope', '$stateParams', '$location', 'Scoreboard', 'Group' , function ($scope, $stateParams, $location, Scoreboard, Group) {
  //define connects gameid
  $scope.connectID = 1;
  //define flaggers gameid
  $scope.flaggerID = 2;
  //set amount of scores to shoq
  $scope.quantityOfScores = 10;
  //set title
  $scope.tableTitle = "HALL OF FAME";
  //set subtitle. Subtitle is name of the game
  $scope.gameName = ($stateParams.gameid == $scope.connectID)?'Connect':'Flagger';
  //order property for ordering list of scores
  $scope.orderProp = "points";
  //get gameid from url-parameters
  $scope.gameid = $stateParams.gameid;
  //init groupid
  $scope.groupid = 0;
  //filter-function for score-list. Limits the length of list by $scope.quantityOfScores
  $scope.limit = function(items){
    return items.slice(0,$scope.quantityOfScores)
  }
  //filter-function for score-list. Filters scores by groupid
  //default groupid == 0 shows all scores
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
  //get the name of group by its id
  $scope.nameOfGroup = function(groupid){
    if(!$scope.groups) return
    for(var i = 0; i < $scope.groups.length ; i++){
      if($scope.groups[i].id == groupid){
        return $scope.groups[i].name
      }
    }
  }
  //get the scores by gameid
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
  //set groups to $scope.groups
  $scope.getGroups = function(){
    Group.query(function(groups){
      $scope.groups = groups;
    })
  }
  //switch groupid
  $scope.switchGroup = function(){
    if($(this)[0].group.id){
      $scope.groupid = $(this)[0].group.id;
    }
  }
  //switch level
  $scope.switchLevel = function(){
    if($(this)[0].level.id){
      $scope.groupid = $(this)[0].level.id;
    }
  }
  //init $scope.groupid
  $scope.resetGroup = function(){
    $scope.groupid = 0
  }
}]);
