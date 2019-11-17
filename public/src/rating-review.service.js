(function () {

'use strict';

angular.module('FlickList')
.service('RatingReviewService', RatingReviewService);

RatingReviewService.$inject = ['$http'];
function RatingReviewService ($http) {
  var service = this;

  // Review methods

  service.getReviewsForMovie = function (imdbID) {
    return $http.get('http://localhost:8080/reviews/' + imdbID).then(function (response) {
      return response.data;
    });
  };

  service.getUserReviewForMovie = function (imdbID, user) {
    return $http.get('http://localhost:8080/reviews/' + imdbID + '/' + user).then(function (response) {
      return response.data;
    });
  };

  service.deleteReviewForMovie = function (id) {
    return $http.delete('http://localhost:8080/reviews/delete/' + id).then(function (response) {
      return response.data;
    });
  };

  service.postReview = function (imdbID, user, rating, headline, review) {
    var entry = { "imdbID": imdbID,
                  "user": user,
                  "rating": rating,
                  "headline": headline,
                  "review": review };
    return $http({
        url: 'http://localhost:8080/reviews/post',
        method: 'POST',
        data: entry
    }).then(function (response) {
      return response;
    });
  };


  // Rating methods

  service.getRating = function (imdbID) {
    return $http.get('http://localhost:8080/ratings/' + imdbID).then(function (response) {
      return response.data;
    });
  };

  service.deleteRating = function (id) {
    return $http.delete('http://localhost:8080/ratings/delete/' + id).then(function (response) {
      return response.data;
    });
  };

  service.postRating = function (imdbID, rating_count, rating_avg) {
    var entry = { "imdbID": imdbID,
                  "rating_count": rating_count,
                  "rating_avg": rating_avg };
    return $http({
      url: 'http://localhost:8080/ratings/post',
      method: 'POST',
      data: entry
    }).then(function (response) {
      return response;
    });
  };

};

})();
