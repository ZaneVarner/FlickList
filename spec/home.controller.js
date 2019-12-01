// angular.module('FlickList')
//   .controller('HomeController', ['UserService', 'RecommendationService', function(UserService, RecommendationService){
//     var homeCtrl = this;

//     homeCtrl.$onInit = function () {
//       homeCtrl.username = UserService.getUser();
//       homeCtrl.popularMovies = homeCtrl.getPopularMovies();
//     };
  
//     homeCtrl.getPopularMovies = function () {
//       RecommendationService.getPopularMovies("2019").then(function (response) {
//         homeCtrl.popularMovies = response;
//         return response;
//       });
//     };
//   }]);


  angular.module('FlickList')
  .controller('HomeController', HomeController);
  
  HomeController.$inject = ['UserService', 'RecommendationService'];
  function HomeController (UserService, RecommendationService) {
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
  
  }