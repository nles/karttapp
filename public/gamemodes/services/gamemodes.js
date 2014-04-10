'use strict';

angular.module('karttapp.gamemodes').factory('GameMode', ['$rootScope', function($rootScope) {
  var stateChangeAllowed = true;
  var gameStarted = false;
  // tällä estetetään tilan vaihtaminen kesken pelin
  $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
    if(gameStarted){
      if(!confirm("Game progress will be discarded if you change the page now.")){
        event.preventDefault();
      } else {
        gameStarted = false;
      }
    }
  })
  return {
    startGame: function(){
      gameStarted = true;
    },
    endGame: function(){
      gameStarted = false;
    },
    gameStarted: function(){
      return gameStarted;
    }
  }
}]);
