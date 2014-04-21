'use strict';

angular.module('karttapp.gamemodes')
.controller('ConnectController', ['$scope', '$rootScope', '$http', '$location', 'GameMode','Group', 'Question', function ($scope, $rootScope, $http, $location, GameMode, Group, Question) {
  $scope.score = {};
  // pelimoodin id tietokantaa varten
  $rootScope.gameMode = 1;
  // pelimoodin nimi
  $scope.pageHeader = "Connect country & thing";
  // pisteiden alustus
  $scope.points = 0;
  // pistekerroin, joka kertyy putkeen vastatuista oikeista vastauksista.
  $scope.multiplier = 0;
  $scope.multiplierEffect = {0:'danger',1:'warning',2:'info',3:'success'}
  
  $scope.orderProp = '-likes'

  // kysymykset - haetaan ulkoisesta lähteestä:
  $scope.questions = {}

  $scope.getQuestions = function(groupid){
   $scope.questions = Question.query({
      groupid: groupid
    }, function(questions){
      return questions
    })
    return $scope.questions
  }

  $scope.groups = {}
  $scope.getGroups = function(){
    Group.query(function(groups){
      $scope.groups = groups;
    })
  }
  // estetään tilan vaihtaminen kesken pelin
  $scope.gameStarted = GameMode.gameStarted();
  $scope.startGame = function(){ GameMode.startGame(); }
  $scope.endGame = function(){ GameMode.endGame(); }
  $scope.groupid = 0;
  $scope.selectGroup = function(groupid){
    $scope.groupid = groupid;
    $scope.getQuestions(groupid);
    window.Connect.startGame();
  }
  $scope.voted = false
  $scope.like = function(like){
    $scope.voted = true
    var g = $scope.findGroup()
    if(like){
      g.likes++;
    }else{
      g.likes--;
    }
    $http.post('updateGroup',{
      id: g.id,
      name: g.name,
      likes: g.likes,
      _id: g._id,
      __v: g.__v
    }).success(function(){

    }).error(function(data,status){
      console.log("error " + status + "with" +data)
    });
  }

  $scope.findGroup = function(){
    for(var i = 0 ;i<$scope.groups.length ; i++){
      if($scope.groups[i].id == $scope.groupid){
        return $scope.groups[i]
      }
    }
  }

  $scope.submitScore = function(){
    $.magnificPopup.close();
    $http.post('/saveScore', {
      player: $scope.score.player,
      gameid: $scope.score.gameid,
      points: $scope.score.points,
      groupid: $scope.groupid
    })
    .success(function(){
      // tallennus OK >> ohjaus scoreboard-sivulle..?
      //sulje popup.
      $scope.endGame();
      $location.url('/scoreboard/'+$rootScope.gameMode);
    })
    .error(function(data,status){
      console.log("error "+status+" with "+data);
    });

  };

  // ajetaan "ulkoinen" koodi täältä controllerista (view ladattu)
  window.Connect.init();

}]);
