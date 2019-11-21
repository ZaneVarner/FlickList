(function () {
"use strict";

angular.module('FlickList')
.service('RecommendationService', RecommendationService);

RecommendationService.$inject = ['$http', 'API_PATH'];
function RecommendationService ($http, API_PATH) {
  var service = this;

  service.getRecommendations = function (userMovieName, UserMovieGenre) {
    var sameGenreMovies = $http.get(API_PATH + '/movies/genre/' + userMovieGenre).then(function (response) {
      return response.data;
    });
    console.log(sameGenreMovies);
    return sameGenreMovies;
  };

  service.getPopularNow = function (year) {
    return $http.get(API_PATH + '/movies/popular/' + year).then(function (response) {
      return response.data;
    });
  };

}

})();
