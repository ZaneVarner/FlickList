angular.module('FlickList', [])
  .controller('HomeController', function(dataSvc){
    var vm=this;

    vm.saveData = function(){
      dataSvc.save(vm.bookDetails).then(function(result){
        vm.bookDetails = {};
        vm.bookForm.$setPristine();
      });
    };

    vm.numberPattern = /^\d*$/;
  });
