(function () {
'use strict';

angular.module('FlickList')
.controller('LoginController', LoginController);

LoginController.$inject = ['$firebaseAuth', '$state', 'UserService'];
function LoginController ($firebaseAuth, $state, UserService) {
  var loginCtrl = this;

  loginCtrl.$onInit = function () {
    loginCtrl.username = UserService.getUser();

    if (loginCtrl.username) {
      $state.go('root.home');
    }
  };

  loginCtrl.login = function () {
    var username = loginCtrl.userEmail;
    var password = loginCtrl.userPassword;
    var auth = $firebaseAuth();

    auth.$signInWithEmailAndPassword(username, password).then(function() {
			console.log("User Login Successful");
      UserService.setUser(username);
			$state.go('root.home');
		}).catch(function(error){
			loginCtrl.errMsg = true;
			loginCtrl.errorMessage = error.message;
		});
  };

}

})();
