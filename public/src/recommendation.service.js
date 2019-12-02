(function () {
"use strict";

angular.module('FlickList')
.service('RecommendationService', RecommendationService);

RecommendationService.$inject = ['$http', 'API_PATH'];
function RecommendationService ($http, API_PATH) {
  var service = this;

  service.getPopularMovies = function (year) {
    return $http.get(API_PATH + '/movies/popular/' + year).then(function (response) {
      return response.data;
    });
  };

  service.getMoviesByKeyword = function (string) {
    return $http.get(API_PATH + '/movies/keyword/string/' + string).then(function (response) {
      return response.data;
    });
  };

}

})();
