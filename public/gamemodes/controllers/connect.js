'use strict';

angular.module('karttapp.gamemodes')
.controller('ConnectController', ['$scope', '$rootScope', '$http', '$location', 'GameMode','Group', 'Question', function ($scope, $rootScope, $http, $location, GameMode, Group, Question) {
  //init current score
  $scope.score = {};
  // gameid for database
  $rootScope.gameMode = 1;
  // name of the game
  $scope.pageHeader = "Connect country & thing";
  // init points
  $scope.points = 0;
  // multiplier for points
  $scope.multiplier = 0;
  $scope.multiplierEffect = {0:'danger',1:'warning',2:'info',3:'success'}
  // order property for questiongroups.
  // orders list by likes
  $scope.orderProp = '-likes'
  // init questions
  $scope.questions = {}
  /**
  * Set questions by given groupid to $scope.questions
  * @attr: groupid > 0
  * @return: $scope.questions
  */
  $scope.getQuestions = function(groupid){
   $scope.questions = Question.query({
      groupid: groupid
    }, function(questions){
      return questions
    })
    return $scope.questions
  }
  //init questiongroups
  $scope.groups = {}
  //Get all available questiongroups and set them to $scope.groups
  $scope.getGroups = function(){
    Group.query(function(groups){
      $scope.groups = groups;
    })
  }
  // estetään tilan vaihtaminen kesken pelin
  $scope.gameStarted = GameMode.gameStarted();
  $scope.startGame = function(){ GameMode.startGame(); }
  $scope.endGame = function(){ GameMode.endGame(); }

  //init groupid: 0 == game have not questiongroups
  $scope.groupid = 0;

  /*
  * Get questions by given groupid and starts the game
  *
  */
  $scope.selectGroup = function(groupid){
    $scope.groupid = groupid;
    $scope.getQuestions(groupid);
    window.Connect.startGame();
  }
  //init voted
  $scope.voted = false
  // updates questiongroup.
  // @attr like == true -> method add one like to questiongroup
  // @attr like == false -> method decrease likes in questiongroup
  $scope.like = function(like){
    if(!$scope.score.player || $scope.score.player == ""){
      $scope.showErr = true
      return
    }
    $scope.voted = true
    var continueToHOF = function(){
      setTimeout(function(){
        $scope.submitScore()
      },500)
    }
    var g = $scope.findGroup()
    if(g){
      if(like){
        g.likes++;
      } else{
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
      continueToHOF();
    } else {
      console.log("err")
      continueToHOF();
    }
  }
  //get group by $scope.groupid
  $scope.findGroup = function(){
    for(var i = 0; i < $scope.groups.length; i++){
      if($scope.groups[i].id == $scope.groupid){
        return $scope.groups[i]
      }
    }
  }
  //save score to database and continues to HALL OF FAME-page
  $scope.submitScore = function(){
    $.magnificPopup.close();
    $http.post('/saveScore', {
      player: $scope.score.player.toUpperCase(),
      gameid: $scope.score.gameid,
      points: $scope.score.points,
      groupid: $scope.groupid
    })
    .success(function(){
      $scope.endGame();
      $location.url('/scoreboard/'+$rootScope.gameMode);
    })
    .error(function(data,status){
      console.log("error "+status+" with "+data);
      $location.url('/scoreboard/'+$rootScope.gameMode);
    });

  };

  // ajetaan pelimoodin koodi (view ladattu)
  window.Connect.init();

}]);
