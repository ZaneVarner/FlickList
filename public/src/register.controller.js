(function () {
'use strict';

angular.module('FlickList')
.controller('RegisterController', RegisterController);

RegisterController.$inject = ['$firebaseAuth', '$state', 'UserService', 'ListService'];
function RegisterController ($firebaseAuth, $state, UserService, ListService) {
  var regCtrl = this;

  regCtrl.register = function () {
    var username = regCtrl.userEmail;
		var password = regCtrl.userPassword;

		if (username && password){
			var auth = $firebaseAuth();
			auth.$createUserWithEmailAndPassword(username, password).then(function() {
				console.log("User Successfully Created");
        auth.$signInWithEmailAndPassword(username, password).then(function() {
    			console.log("User Login Successful");
          UserService.setUser(username);

          // Create the 3 main lists for the user

          ListService.postList(username, 'Watch List', []).then(function (response) {
            ListService.postList(username, 'Watched', []).then(function (response) {
              ListService.postList(username, 'Favorites', []).then(function (response) {
                $state.go('root.home');
              });
            });
          });

    		});
			}).catch(function(error){
				regCtrl.errMsg = true;
				regCtrl.errorMessage = error.message;
			});
		}
  };

}

})();
