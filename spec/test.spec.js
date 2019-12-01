describe('wat', function(){
  var mockUserService, rootScope, scope, passPromise, secondController;

  beforeEach(function(){
    module(function($provide){
      $provide.factory('UserService', ['$q', function($q){
        function save(data){
          if(passPromise){
            return $q.when();
          } else {
            return $q.reject();
          }
        }

        return {
          save: save
        };
      }]);
    });

    module('FlickList');
  });

  beforeEach(inject(function($rootScope, $controller, UserService){
    rootScope = $rootScope;
    scope = $rootScope.$new();
    mockUserService = UserService;
  }));

  describe('secondController', function(){
    beforeEach(inject(function($controller){
      secondController = $controller('HomeController',{
        UserService: mockUserService
      });
    }));

    it('should have set pattern to match numbers', function(){
      expect(secondController.numberPattern).toBeDefined();
      expect(secondController.numberPattern.test("100")).toBe(true);
      expect(secondController.numberPattern.test("100aa")).toBe(false);
    });

    it('should call save method on UserService on calling saveData', function(){
      secondController.bookDetails ={
        bookId: 1,
        name: "Mastering Web application development using AngularJS",
        author: "Peter and Pawel"
      };
      secondController.bookForm ={
        $setPristine: jasmine.createSpy('$setPristine')
      };
      passPromise = true;
      secondController.saveData();
      rootScope.$digest();

      expect(secondController.bookDetails).toEqual({});
      expect(secondController.bookForm.$setPristine).toHaveBeenCalled();
    });
  });
});
