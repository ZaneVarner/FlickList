(function () {
'use strict';

angular.module('FlickList')
.controller('ListController', ListController);

ListController.$inject = ['listName', 'listDetail', '$state', '$timeout', 'ListService', 'UserService'];
function ListController (listName, listDetail, $state, $timeout, ListService, UserService) {
  var listCtrl = this;

  listCtrl.listName = listName;
  listCtrl.listDetail = listDetail;

  listCtrl.$onInit = function () {
  };

  listCtrl.shiftPosition = async function (oldPosition, newPosition) {
    // Get the current user
    var user = UserService.getUser();
    var listName = listCtrl.listDetail.listName;

    // Do not allow a movie to be shifting out of range
    if (newPosition < 0 || newPosition > listCtrl.listDetail.list.length - 1) {
      return;
    }

    // Get the movie that is being shifted
    var shiftingMovie = listCtrl.listDetail.list[oldPosition];

    // Remove the movie from the list
    var newList = listCtrl.listDetail.list.filter(function (value, index, arr) {
      return value != shiftingMovie;
    });

    // Insert the movie into the new position
    newList.splice(newPosition, 0, shiftingMovie);

    console.log(newList);

    // Get the old list document
    var get_response = await ListService.getListData(user, listName).then(function (response) {
      return response;
    });

    console.log(get_response);
    console.log(get_response.list);
    console.log(newList);

    // Delete the old list document
    var delete_response = await ListService.deleteList(get_response._id).then(function (response) {
      return response;
    });

    // Post the new list document
    var post_response = await ListService.postList(user, listName, newList).then(function (response) {
      return response;
    });

    $timeout(function () {
      listCtrl.updateList();
    });


  };

  listCtrl.deleteMovieFromList = async function () {
    var user = UserService.getUser();
    var listName = listCtrl.listDetail.listName;

    // Get the movie that is being deleted
    var movieToDelete = listCtrl.movieToDelete;

    // Remove the movie from the list
    var newList = listCtrl.listDetail.list.filter(function (value, index, arr) {
      return value != movieToDelete;
    });

    console.log(newList);

    // Get the old list document
    var get_response = await ListService.getListData(user, listName).then(function (response) {
      return response;
    });

    console.log(get_response);
    console.log(get_response.list);
    console.log(newList);

    // Delete the old list document
    var delete_response = await ListService.deleteList(get_response._id).then(function (response) {
      return response;
    });

    // Post the new list document
    var post_response = await ListService.postList(user, listName, newList).then(function (response) {
      return response;
    });

    $timeout(function () {
      listCtrl.updateList();
    });

  };

  listCtrl.updateList = function () {
    var user = UserService.getUser();
    var listName = listCtrl.listDetail.listName;
    ListService.getListData(user, listName).then(function (response) {
      listCtrl.listDetail = response;
      return response;
    });
  };

  listCtrl.deleteList = function () {
    var user = UserService.getUser();
    var listName = listCtrl.listName;

    ListService.getListData(user, listName).then(function (response) {
      ListService.deleteList(response._id).then(function (response) {
        $('#deleteListModal').modal('hide');
        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove();
        $state.go('root.my-lists');
        return response;
      });
    });
  };

}

})();
