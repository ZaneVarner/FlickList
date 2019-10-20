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

  //   var promise = MovieSearchService.searchMovies(searchTerm, page);
  //   promise.then(function (result) {
  //     if (result.Response == "False") {
  //       movieSearchCtrl.showMovies = false;
  //       movieSearchCtrl.error.noResultFound = true;
  //       movieSearchCtrl.movies = [];
  //       return;
  //     }
  //
  //     movieSearchCtrl.movies = result.Search;
  //     movieSearchCtrl.totalResults = parseInt(result.totalResults);
  //
  //     movieSearchCtrl.showMovies = true;
  //     movieSearchCtrl.error.noResultFound = false;
  //     movieSearchCtrl.searchTerm = searchTerm;
  //
  //     movieSearchCtrl.previousPage = page - 1;
  //     movieSearchCtrl.thisPage = page;
  //     movieSearchCtrl.nextPage = page + 1;
  //     movieSearchCtrl.totalPages = Math.ceil(movieSearchCtrl.totalResults / 10);
  //     movieSearchCtrl.isLastPage = movieSearchCtrl.thisPage == movieSearchCtrl.totalPages;
  //
  //     if (movieSearchCtrl.isLastPage) {
  //       movieSearchCtrl.lastTitleOnPage = movieSearchCtrl.totalResults;
  //     } else {
  //       movieSearchCtrl.lastTitleOnPage = movieSearchCtrl.thisPage * 10;
  //     }
  //     movieSearchCtrl.firstTitleOnPage = movieSearchCtrl.thisPage * 10 - 9;
  //   });
  //
  // };

}

})();
