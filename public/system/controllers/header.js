'use strict';

angular.module('karttapp.system')
.controller('HeaderController',['$scope', '$rootScope', 'Global', 'Menus', function($scope, $rootScope, Global, Menus) {
  $scope.global = Global;

  $scope.menus = {
    main: [{
      'roles': ['anonymous','authenticated'],
      'title': 'Game Modes',
      'link': 'home'
    },{
      'roles': ['anonymous','authenticated'],
      'title': 'HALL OF FAME',
      'link': 'scoreboard'
    },{
      'roles': ['authenticated'],
      'title': 'Update data',
      'link': 'connect'
    },{
      'roles': ['anonymous','authenticated'],
      'title': 'Create new question',
      'link': 'question'
    }]
  }

  Menus.query({
    name: 'main'
  }, function(mainMenu) {
    $scope.menus.main = $scope.menus.main.concat(mainMenu);
  });

  $scope.isCollapsed = true;

  $rootScope.$on('loggedin', function() {
    $scope.global = {
      authenticated: !! $rootScope.user,
      user: $rootScope.user
    };
  });

}]);
