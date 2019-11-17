(function () {
'use strict';

angular.module('FlickList')
.service('ListService', ListService);

ListService.$inject = ['$http', 'API_PATH'];
function ListService ($http, API_PATH) {
  var service = this;

  service.getListData = function (user, listName) {
    return $http.get(API_PATH + '/lists/' + user + '/' + listName).then(function (response) {
      return response.data;
    });
  };

  service.getUserLists = function (user) {
    return $http.get(API_PATH + '/lists/' + user).then(function (response) {
      return response.data;
    });
  };

  service.getMovieByID = function (imdbID) {
    return $http.get(API_PATH + '/movies/' + imdbID).then(function (response) {
      return response.data;
    });
  };

  service.deleteList = function (id) {
    return $http.delete(API_PATH + '/lists/delete/' + id).then(function (response) {
      return response.data;
    });
  };

  service.postList = function (user, listName, list) {
    var entry = { 'user': user,
                  'listName': listName,
                  'list': list };
    return $http({
      url: API_PATH + '/lists/post',
      method: 'POST',
      data: entry
    }).then(function (response) {
      return response;
    });
  };

}

})();
