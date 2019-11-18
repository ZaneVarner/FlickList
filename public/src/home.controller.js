(function () {
'use strict';

angular.module('FlickList')
.controller('HomeController', HomeController);

HomeController.$inject = ['UserService', 'RecommendationService'];
function HomeController (UserService, RecommendationService) {
  var homeCtrl = this;

  homeCtrl.$onInit = function () {
    homeCtrl.username = UserService.getUser();
  };

  homeCtrl.getPopularNow = function () {
    RecommendationService.getPopularNow("2017").then(function (response) {
      homeCtrl.popularNow = response;
      console.log(response);
      return response;
    });
  };
}

})();
