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
    RecommendationService.getPopularNow("2019").then(function (response) {
      homeCtrl.popularNow = response;
      console.log(response);
      return response;
    });
  };

  homeCtrl.getMovieByKeyword = function () {
    RecommendationService.getMovieByKeyword("Star Wars").then(function (response) {
      homeCtrl.keywordResults = response;
      homeCtrl.keywordResults.sort((a, b) => (a.imdbVotes > b.imdbVotes) ? -1 : 1);
      console.log(homeCtrl.keywordResults);
      return response;
    });
  };

}

})();
