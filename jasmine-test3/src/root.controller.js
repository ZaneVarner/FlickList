(function () {
'use strict';

angular.module('FlickList')
.controller('RootController', RootController);

RootController.$inject = ['UserService', '$state'];
function RootController (UserService, $state) {
    var rootCtrl = this;

    rootCtrl.$onInit = function () {
      $state.go('root.home');

      rootCtrl.username = UserService.getUser();

      if (!rootCtrl.username) {
        $state.go('login');
      }
    };

    rootCtrl.logout = function () {
      UserService.logout();
    };
}

})();
