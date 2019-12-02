describe('HomeController', function(){
  var mockUserService, mockRecService, rootScope, passPromise, homeCtrl;

  beforeEach(function(){
    angular.module('firebase', [])
    angular.module('MovieSearch', [])
    module('FlickList');

    module(function($provide){
      $provide.factory('UserService', ['$q', function($q){
        function getUser(){
          if(passPromise){
            return $q.when();
          } else {
            return $q.reject();
          }
        }

        return {
          getUser: getUser
        };
      }]);

      $provide.factory('RecommendationService', ['$q', function($q){
        function getPopularMovies(data){
          if(passPromise){
            return $q.when();
          } else {
            return $q.reject();
          }
        }

        return {
          getPopularMovies: getPopularMovies
        };
      }]);
    });
  });

  beforeEach(inject(function($rootScope, $controller, UserService, RecommendationService){
    rootScope = $rootScope;
    mockUserService = UserService;
    mockRecService = RecommendationService;
    homeCtrl = $controller('HomeController',{
      UserService: mockUserService,
      RecommendationService: mockRecService
    });
  }));

  it('should initialize properly', function(){
    passPromise = true;
    homeCtrl.$onInit();
    rootScope.$digest();
  });
});
