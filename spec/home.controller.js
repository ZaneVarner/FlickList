angular.module('FlickList', [])
  .controller('HomeController', function(UserService){
    var homeCtrl=this;

    homeCtrl.saveData = function(){
        UserService.getUser().then(function(result){
        homeCtrl.bookDetails = {};
        homeCtrl.bookForm.$setPristine();
      });
    };

    homeCtrl.numberPattern = /^\d*$/;
  });
