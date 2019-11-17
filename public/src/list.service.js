(function () {
'use strict';

angular.module('FlickList')
.service('ListService', ListService);

ListService.$inject = ['$http'];
function ListService ($http) {
  var service = this;

  service.getListData = function (user, listName) {
    return $http.get('http://localhost:8080/lists/' + user + '/' + listName).then(function (response) {
      return response.data;
    });
  };

  service.getUserLists = function (user) {
    return $http.get('http://localhost:8080/lists/' + user).then(function (response) {
      return response.data;
    });
  };

  service.getMovieByID = function (imdbID) {
    return $http.get('http://localhost:8080/movies/' + imdbID).then(function (response) {
      return response.data;
    });
  };

  service.deleteList = function (id) {
    return $http.delete('http://localhost:8080/lists/delete/' + id).then(function (response) {
      return response.data;
    });
  };

  service.postList = function (user, listName, list) {
    var entry = { 'user': user,
                  'listName': listName,
                  'list': list };
    return $http({
      url: 'http://localhost:8080/lists/post',
      method: 'POST',
      data: entry
    }).then(function (response) {
      return response;
    });
  };

}

})();
