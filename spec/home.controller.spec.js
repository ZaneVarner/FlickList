describe('Test', function(){
  var mockUserService, mockRecService, rootScope, scope, passPromise, homeCtrl;

  beforeEach(function(){
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

    module('FlickList');
  });

  beforeEach(inject(function($rootScope, $controller, UserService, RecommendationService){
    rootScope = $rootScope;
    scope = $rootScope.$new();
    mockUserService = UserService;
    mockRecService = RecommendationService;
  }));

  describe('HomeController', function(){
    beforeEach(inject(function($controller){
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
});
