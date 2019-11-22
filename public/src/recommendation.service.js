(function () {
"use strict";

angular.module('FlickList')
.service('RecommendationService', RecommendationService);

RecommendationService.$inject = ['$http', 'API_PATH'];
function RecommendationService ($http, API_PATH) {
  var service = this;

  service.getRecommendations = function (topUserMovies) {
    var inputList = topUserMovies;


  };

  service.getPopularNow = function (year) {
    return $http.get(API_PATH + '/movies/popular/' + year).then(function (response) {
      return response.data;
    });
  };

  service.getMovieByKeyword = function (title) {
    return $http.get(API_PATH + '/movies/keyword/title/' + title).then(function (response) {
      return response.data;
    });
  };

}

})();
