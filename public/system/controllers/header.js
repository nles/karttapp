'use strict';

angular.module('karttapp.system')
.controller('HeaderController',['$scope', '$rootScope', 'Menus', function($scope, $rootScope, Menus) {

  $scope.menus = {
    main: [{
      'roles': ['anonymous','authenticated'],
      'title': 'Game Modes',
      'link': 'home'
    },{
      'roles': ['anonymous','authenticated'],
      'title': 'Hall Of Fame',
      'link': 'scoreboard'
    }]
  }
/*
  Menus.query({
    name: 'main'
  }, function(mainMenu) {
    $scope.menus.main = $scope.menus.main.concat(mainMenu);
  });

  $scope.isCollapsed = true;*/
//SWAP


  // Default hard coded menu items for main menu
  var defaultMainMenu = [];

  Menus.query({
    name: 'main',
  }, function(menu) {
    $scope.menus.main = $scope.menus.main.concat(menu);
  });


  $scope.isCollapsed = false;

}]);
