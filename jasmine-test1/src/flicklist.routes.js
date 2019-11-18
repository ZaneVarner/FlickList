(function () {
'use strict';

angular.module('FlickList')
.config(RoutesConfig);

RoutesConfig.$inject = ['$stateProvider', '$urlRouterProvider'];
function RoutesConfig($stateProvider, $urlRouterProvider) {

  // Redirect to 'login' tab if no other URL matches
  $urlRouterProvider.otherwise('/login');

  $stateProvider
    .state('login', {
      url: '/login',
      templateUrl: 'src/templates/login.template.html',
      controller: 'LoginController',
      controllerAs: 'loginCtrl'
    })

    .state('register', {
      url: '/register',
      templateUrl: 'src/templates/register.template.html',
      controller: 'RegisterController',
      controllerAs: 'regCtrl'
    })

    .state('root', {
      url: '',
      templateUrl: 'src/templates/root.template.html',
      controller: 'RootController',
      controllerAs: 'rootCtrl'
    })

    .state('root.home', {
      url: '/home',
      templateUrl: 'src/templates/home.template.html',
      controller: 'HomeController',
      controllerAs: 'homeCtrl'
    })

    .state('root.movie-search', {
      url: '/movie-search',
      templateUrl: 'src/templates/movie-search.template.html',
      controller: 'MovieSearchController',
      controllerAs: 'movieSearchCtrl'
    })

    .state('root.movie-detail', {
      url: '/movie-detail/{movieID}',
      templateUrl: 'src/templates/movie-detail.template.html',
      controller: 'MovieDetailController',
      controllerAs: 'movieDetailCtrl',
      resolve: {
        movieDetail: ['$stateParams', 'MovieSearchService',
          function ($stateParams, MovieSearchService) {
            return MovieSearchService.getMovieDetail($stateParams.movieID);
          }]
      }
    });

}

})();
