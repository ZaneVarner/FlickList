(function () {
"use strict";

angular.module('FlickList')
.service('RecommendationService', RecommendationService);

RecommendationService.$inject = ['$http', 'API_PATH'];
function RecommendationService ($http, API_PATH) {
  var service = this;

  service.getRecommendations = function (userMovie) {
    var sameGenreMovies = $http.get(API_PATH + '/movies/genre/' + userMovie.genre).then(function (response) {
      return response.data;
    });
    var movieList = sameGenreMovies.toArray();
    for(var movie : movieList) {

    }
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

class Heap {

  var heapSize;
  var lowestValue;
  var heap = [];

  constructor(thisHeapSize) {
    heapSize = thisHeapSize;
  }

  insertCheck(newValue) {
    if(heap.length < heapSize) {
      heap.push(newValue);
      if(newValue < lowestValue) {
        lowestValue = newValue;
      }
      heap.sort(function(a, b){return b - a});
    }
    else if(newValue > lowestValue) {
      heap.pop();
      heap.push(newValue);
      heap.sort(function(a, b){return b - a});
    }
  }

  getHeap() {
    return heap;
  }

  getLowestValue() {
    return lowestValue;
  }

  getHeapSize() {
    return heapSize;
  }
}
