(function () {
"use strict";

angular.module('MovieSearch')
.service('MovieSearchService', MovieSearchService);

MovieSearchService.$inject = ['$http'];
function MovieSearchService ($http) {
  var service = this;


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
      return $http.get('http://localhost:8080/movies/title/' + searchTerm + '/' + sortBy + '/' + order)
          .then(function (response) {
        console.log(searchType);
        console.log(response.data);
        return response.data;
      });
    } else if (searchType == 'Cast') {
      return $http.get('http://localhost:8080/movies/cast/' + searchTerm + '/' + sortBy + '/' + order)
          .then(function (response) {
        console.log(searchType);
        console.log(response.data);
        return response.data;
      });
    } else if (searchType == 'Genre') {
      return $http.get('http://localhost:8080/movies/genre/' + searchTerm + '/' + sortBy + '/' + order)
          .then(function (response) {
        console.log(searchType);
        console.log(response.data);
        return response.data;
      });
    }

  };


  // service.searchMovies = function (searchTerm, page) {
  //   return $http({
  //     method: "GET",
  //     // url: "https://www.omdbapi.com/?s=star+wars&apikey=e94b6bc1",
  //     url: "https://www.omdbapi.com/",
  //     params: {
  //       s: searchTerm,
  //       type: "movie",
  //       page: page,
  //       apikey: "44664e4"
  //     }
  //   }).then(function (result) {
  //     return result.data;
  //   });
  // };

  service.getMovieDetail = function (movieTitle) {
    return $http({
      method: "GET",
      url: "https://www.omdbapi.com/",
      params: {
        i: movieTitle,
        plot: "full",
        apikey: "44664e4"
      }
    }).then(function (result) {
      return result.data;
    });
  };

}

})();
