(function () {
"use strict";

angular.module('MovieSearch')
.service('MovieSearchService', MovieSearchService);

MovieSearchService.$inject = ['$http'];
function MovieSearchService ($http) {
  var service = this;


  service.searchMoviesByType = function (searchTerm, searchType, sortType) {

    var sortBy = '';
    if (sortType == 'relevance') {
      sortBy = 'imdbVotes';
    } else if (sortType == 'rating') {
      sortBy = 'imdbRating';
    } else if (sortType == 'year') {
      sortBy = 'Year';
    }
    var sortOrder = -1;

    if (searchType == 'Title') {
      return $http.get('http://localhost:8080/movies/title/' + searchTerm + '/' + sortBy + '/' + sortOrder)
          .then(function (response) {
        console.log(searchType);
        console.log(response.data);
        return response.data;
      });
    } else {
      return $http.get('http://localhost:8080/movies/cast/' + searchTerm + '/' + sortBy + '/' + sortOrder)
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
        t: movieTitle,
        plot: "full",
        apikey: "44664e4"
      }
    }).then(function (result) {
      return result.data;
    });
  };

}

})();
