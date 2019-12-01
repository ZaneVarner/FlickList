angular.module('FlickList', [])
  .controller('HomeController', function(UserService, RecommendationService){
    var homeCtrl = this;

    homeCtrl.$onInit = function () {
      homeCtrl.username = UserService.getUser();
      homeCtrl.popularMovies = homeCtrl.getPopularMovies();
    };
  
    homeCtrl.getPopularMovies = function () {
      RecommendationService.getPopularMovies("2019").then(function (response) {
        homeCtrl.popularMovies = response;
        return response;
      });
    };
  });
