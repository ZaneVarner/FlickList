angular.module('FlickList', [])
  .controller('HomeController', function(UserService, RecommendationService){
    var homeCtrl=this;

    homeCtrl.saveData = function(){
        UserService.getUser().then(function(result){
        homeCtrl.bookDetails = {};
        homeCtrl.bookForm.$setPristine();
      });
    };

    homeCtrl.numberPattern = /^\d*$/;

    homeCtrl.getPopularMovies = function () {
        RecommendationService.getPopularMovies("2019").then(function (result) {
          homeCtrl.popularMovies = result;
          return result;
        });
    };
  });
