(function () {

'use strict';

angular.module('FlickList')
.controller('MyListsController', MyListsController);

MyListsController.$inject = ['$timeout', 'ListService', 'UserService'];
function MyListsController ($timeout, ListService, UserService) {
  var myListsCtrl = this;

  myListsCtrl.userLists = [];
  myListsCtrl.watchList = null;
  myListsCtrl.watched = null;
  myListsCtrl.favorites = null;
  myListsCtrl.customLists = [];

  myListsCtrl.$onInit = async function () {
    myListsCtrl.updateMyLists();
  };

  myListsCtrl.updateMyLists = async function () {
    var user = UserService.getUser();

    var get_user_lists_response = await ListService.getUserLists(user).then(function (response) {
      myListsCtrl.userLists = response;
      myListsCtrl.customLists = [];

      for (var listIndex in myListsCtrl.userLists) {
        var list = myListsCtrl.userLists[listIndex];
        if (list.listName == 'Watch List') {
          myListsCtrl.watchList = list;
          console.log(myListsCtrl.watchList);
        } else if (list.listName == 'Watched') {
          myListsCtrl.watched = list;
        } else if (list.listName == 'Favorites') {
          myListsCtrl.favorites = list;
        } else {
          myListsCtrl.customLists.push(list);
        }
      }

      myListsCtrl.customLists.sort((a, b) => (a.list.length > b.list.length) ? -1 : 1);

      return response;
    });

  };

  myListsCtrl.createNewList = function (newListName) {
    var user = UserService.getUser();

    ListService.postList(user, newListName, []).then(function (response) {
      $timeout(function () {
        myListsCtrl.customLists.push({'user': user, 'listName': newListName, 'list': []});
      })
      return response;
    });
  };

  myListsCtrl.deleteList = function () {
    var user = UserService.getUser();
    var listName = myListsCtrl.listToDelete;

    ListService.getListData(user, listName).then(function (response) {
      ListService.deleteList(response._id).then(function (response) {
        myListsCtrl.updateMyLists();
        return response;
      });
    });
  };

  myListsCtrl.plotSubstring = function (plotString) {
    if (plotString.length > 100) {
      return plotString.substring(0, 100).concat('...');
    } else {
      return plotString;
    }
  };

}

})();
