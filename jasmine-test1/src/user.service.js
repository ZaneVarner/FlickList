(function () {
'use strict';

angular.module('FlickList')
.service('UserService', UserService);

UserService.$inject = ['$firebaseAuth', '$state'];
function UserService ($firebaseAuth, $state) {
  var service = this;
  service.user = "";

  service.getUser = function () {
    if (service.user == "") {
      service.user = localStorage.getItem('userEmail');
    }
    return service.user;
  };

  service.setUser = function (value) {
    localStorage.setItem('userEmail', value);
    service.user = value;
  };

  service.logout = function () {
    var auth = $firebaseAuth();
    auth.$signOut();
    console.log("Logged Out Succesfully");
		service.user = "";
    localStorage.removeItem('userEmail');
		$state.go('login');
  };

}

})();
