describe('wat', function(){
  var mockDataSvc, rootScope, scope, passPromise, secondController;

  beforeEach(function(){
    module(function($provide){
      $provide.factory('dataSvc', ['$q', function($q){
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

  beforeEach(inject(function($rootScope, $controller, dataSvc){
    rootScope = $rootScope;
    scope = $rootScope.$new();
    mockDataSvc = dataSvc;
    spyOn(mockDataSvc, 'save').and.callThrough();
  }));

  describe('secondController', function(){
    beforeEach(inject(function($controller){
      secondController = $controller('HomeController',{
        dataSvc: mockDataSvc
      });
    }));

    it('should have set pattern to match numbers', function(){
      expect(secondController.numberPattern).toBeDefined();
      expect(secondController.numberPattern.test("100")).toBe(true);
      expect(secondController.numberPattern.test("100aa")).toBe(false);
    });

    it('should call save method on dataSvc on calling saveData', function(){
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

      expect(mockDataSvc.save).toHaveBeenCalled();
      expect(secondController.bookDetails).toEqual({});
      expect(secondController.bookForm.$setPristine).toHaveBeenCalled();
    });
  });
});