(function () {
"use strict";

angular.module('MovieSearch')
.controller('MovieSearchController', MovieSearchController);

MovieSearchController.$inject = ['MovieSearchService'];
function MovieSearchController(MovieSearchService) {

  var movieSearchCtrl = this;

  movieSearchCtrl.showMovies = false;
  movieSearchCtrl.error = {
    noResultFound: false
  };
  movieSearchCtrl.movies = [];

  movieSearchCtrl.searchType = 'Title';
  movieSearchCtrl.searchGenre = 'Action';
  movieSearchCtrl.sort = 'relevance';
  movieSearchCtrl.sortingRatingSite = 'IMDb';
  movieSearchCtrl.yearOrder = 'Newest First';

  movieSearchCtrl.searchMovies = function () {
    var searchTerm = '';
    if (movieSearchCtrl.searchType == 'Genre') {
      searchTerm = movieSearchCtrl.searchGenre;
    } else {
      searchTerm = movieSearchCtrl.inputSearchTerm;
    }

    var searchType = movieSearchCtrl.searchType;

    var sortType = '';
    if (movieSearchCtrl.sort == 'rating') {
      if (movieSearchCtrl.sortingRatingSite == 'Rotten Tomatoes') {
        sortType = 'rottenTomatoesRating';
      } else if (movieSearchCtrl.sortingRatingSite == 'Metacritic') {
        sortType = 'metacriticRating';
      } else {
        sortType = 'imdbRating'
      }
    } else if (movieSearchCtrl.sort == 'year') {
      if (movieSearchCtrl.yearOrder == 'Newest First') {
        sortType = 'sortNewestFirst';
      } else {
        sortType = 'sortOldestFirst';
      }
    } else {
      sortType = 'imdbVotes';
    }

    var promise = MovieSearchService.searchMoviesByType(searchTerm, searchType, sortType);
    promise.then(function (result) {
      movieSearchCtrl.movies = result;
      if (movieSearchCtrl.movies.length == 0) {
        movieSearchCtrl.error.noResultFound = true;
        movieSearchCtrl.showMovies = false;
      } else {
        movieSearchCtrl.error.noResultFound = false;
        movieSearchCtrl.showMovies = true;
        movieSearchCtrl.totalResults = movieSearchCtrl.movies.length;
      }

    });
  };

  movieSearchCtrl.updateResults = function () {
    if (movieSearchCtrl.showMovies) {
      movieSearchCtrl.searchMovies();
    }
  }

  movieSearchCtrl.resetResults = function () {
    movieSearchCtrl.movies = [];
    movieSearchCtrl.showMovies = false;
    movieSearchCtrl.error.noResultFound = false;
  };


}

})();
