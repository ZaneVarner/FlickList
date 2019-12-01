angular.module('FlickList', [])
  .controller('HomeController', function(UserService){
    var vm=this;

    vm.saveData = function(){
        UserService.save(vm.bookDetails).then(function(result){
        vm.bookDetails = {};
        vm.bookForm.$setPristine();
      });
    };

    vm.numberPattern = /^\d*$/;
  });
