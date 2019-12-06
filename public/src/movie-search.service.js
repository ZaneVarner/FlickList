(function () {
"use strict";

angular.module('MovieSearch')
.service('MovieSearchService', MovieSearchService);

MovieSearchService.$inject = ['$http', 'API_PATH'];
function MovieSearchService ($http, API_PATH) {
  var service = this;

  service.getMovieByID = function (imdbID) {
    return $http.get(API_PATH + '/movies/' + imdbID).then(function (response) {
      return response.data;
    });
  };

  service.searchMoviesByType = function (searchTerm, searchType, sortType) {
    var order = -1;
    var sortBy = sortType;
    if (sortType == 'sortNewestFirst') {
      sortBy = 'Year';
    } else if (sortType == 'sortOldestFirst') {
      sortBy = 'Year';
      order = 1;
    }

    if (searchType == 'Title') {
      return $http.get(API_PATH + '/movies/title/' + searchTerm + '/' + sortBy + '/' + order)
          .then(function (response) {
        console.log(searchType);
        console.log(response.data);
        return response.data;
      });
    } else if (searchType == 'Cast') {
      return $http.get(API_PATH + '/movies/cast/' + searchTerm + '/' + sortBy + '/' + order)
          .then(function (response) {
        console.log(searchType);
        console.log(response.data);
        return response.data;
      });
    } else if (searchType == 'Genre') {
      return $http.get(API_PATH + '/movies/genre/' + searchTerm + '/' + sortBy + '/' + order)
          .then(function (response) {
        console.log(searchType);
        console.log(response.data);
        return response.data;
      });
    }
  };

  service.searchMoviesByKeyword = function (keyword) {
    return $http.get(API_PATH + '/movies/' + keyword).then(function (response) {
      console.log("A keyword search was called, obtained: " + response.data);
      return response.data;
    });
  };

  service.getMovieDetail = function (imdbID) {
    return $http.get(API_PATH + '/movies/imdbID/' + imdbID).then(function (response) {
      console.log(response.data);
      return response.data;
    });
  };

}

})();
