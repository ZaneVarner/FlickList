(function () {
"use strict";

angular.module('FlickList')
.service('RecommendationService', RecommendationService);

RecommendationService.$inject = ['$http'];
function RecommendationService ($http) {
  var service = this;

  service.getRecommendations = function (topUserMovies) {
    var inputList = topUserMovies;


  };

}

})();
