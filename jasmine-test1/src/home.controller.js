(function () {
'use strict';

angular.module('FlickList')
.controller('HomeController', HomeController);

HomeController.$inject = ['UserService'];
function HomeController (UserService) {
  var homeCtrl = this;

  homeCtrl.$onInit = function () {
    homeCtrl.username = UserService.getUser();
  };
}

})();
