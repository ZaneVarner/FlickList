(function () {
'use strict';

angular.module('FlickList')
.controller('RegisterController', RegisterController);

RegisterController.$inject = ['$firebaseAuth', '$state'];
function RegisterController ($firebaseAuth, $state) {
  var regCtrl = this;

  regCtrl.register = function () {
    var username = regCtrl.userEmail;
		var password = regCtrl.userPassword;

		if (username && password){
			var auth = $firebaseAuth();
			auth.$createUserWithEmailAndPassword(username, password).then(function() {
				console.log("User Successfully Created");
				$state.go('login');
			}).catch(function(error){
				regCtrl.errMsg = true;
				regCtrl.errorMessage = error.message;
			});
		}
  };

}

})();
