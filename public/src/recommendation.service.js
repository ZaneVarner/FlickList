(function () {
"use strict";

angular.module('FlickList')
.service('RecommendationService', RecommendationService);

RecommendationService.$inject = ['$http', 'API_PATH'];
function RecommendationService ($http, API_PATH) {
  var service = this;
  Heap thisHeap = new Heap(5);

  service.getRecommendations = function (userMovie) {
    var sameGenreMovies = $http.get(API_PATH + '/movies/genre/' + userMovie.genre).then(function (response) {
      return response.data;
    });
    var movieList = sameGenreMovies.toArray();
    for(var movie : movieList) {
      varMovieScore = 0;
      if(movie.director = userMovie.director) {
        varMovieScore++;
      }
      if(movie.primaryActor = userMovie.primaryDirector) {
        varMovieScore++;
      }
      if(movie.secondaryActor = userMovie.secondaryActor) {
        varMovieScore++;
      }
      varMovieScore += 1 / Math.abs(userMovie.year - movie.year);
      thisHeap.insertCheck(varMovieScore, movie);
    }

    var moviesInHeap = [];
    for(var pairing : thisHeap.getHeap()) {
      moviesInHeap.push(pairing[1]);
    }
    console.log(sameGenreMovies);
    return moviesInHeap;
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

  insertCheck(newValue, movie) {
    var movieScoreMapping = [newValue, movie];
    if(heap.length < heapSize) {
      heap.push(movieScoreMapping);
      if(newValue < lowestValue) {
        lowestValue = newValue;
      }
      heap.sort(function(a, b){return b[0] - a[0]});
    }
    else if(newValue > lowestValue) {
      heap.pop();
      heap.push(movieScoreMapping);
      heap.sort(function(a, b){return b[0] - a[0]});
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
