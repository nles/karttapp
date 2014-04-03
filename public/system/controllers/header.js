'use strict';

angular.module('karttapp.system')
.controller('HeaderController',['$scope', '$rootScope', 'Global', 'Menus', function($scope, $rootScope, Global, Menus) {
  $scope.global = Global;

  $scope.menus = {
    main: [{
      'roles': ['anonymous','authenticated'],
      'title': 'Front',
      'link': 'home'
    },{
      'roles': ['anonymous','authenticated'],
      'title': 'Connect',
      'link': 'connect'
    },{
      'roles': ['anonymous','authenticated'],
      'title': 'Scoreboard',
      'link': 'scoreboard'
    },{
      'roles': ['authenticated'],
      'title': 'Update data',
      'link': 'connect'
    }]
  }

  Menus.query({
    name: 'main'
  }, function(mainMenu) {
    $scope.menus.main = $scope.menus.main.concat(mainMenu);
  });

  $scope.isCollapsed = false;

  $rootScope.$on('loggedin', function() {
    $scope.global = {
      authenticated: !! $rootScope.user,
      user: $rootScope.user
    };
  });

}]);
