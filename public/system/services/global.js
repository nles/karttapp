'use strict';

//Global service for global variables
angular.module('karttapp.system')
.factory('Global', [
function() {
  var _this = this;
  _this._data = {
    user: window.user,
    authenticated: !! window.user,
    roles: window.userRoles,
    hasRole: function(roles) {
      var hasRole = false;
      roles.forEach(function(role) {
        if (role == 'anonymous' || window.roles.indexOf('admin') != -1 || window.roles.indexOf(role) != -1) {
          hasRole = true;
        }
      });
      return hasRole;
    }
  }

  return _this._data;
}]);
