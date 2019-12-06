describe("MovieSearchController", function() {

  beforeEach(function () {
    module('MovieSearch');

    module(function ($provide) {
      $provide.service('MovieSearchServiceMock', function () {
        var service = this;
        service.searchMoviesByType = function (searchTerm, searchType, sortType) {
          var promise = new Promise(function (resolve, reject) {
            resolve(123);
          });
          return promise;
          // return promise.then(function (result) {
          //   return result;
          // });
        };

        service.getMovieDetail = function (movieID) {
          return null;
        };
      });
    });
  });

  var $controller;
  var movieSearchController;
  var rootScope;
  var MovieSearchServiceMock;

  beforeEach(inject(function ($rootScope, _$controller_, MovieSearchService) {
    rootScope = $rootScope;
    $controller = _$controller_;
    MovieSearchServiceMock = MovieSearchService;

    movieSearchController = $controller('MovieSearchController',
                  {MovieSearchService: MovieSearchServiceMock});

    movieSearchController.showMovies = false;
    movieSearchController.error = {
      noResultFound: false
    };
    movieSearchController.movies = [];

    movieSearchController.searchType = 'Title';
    movieSearchController.searchGenre = 'Action';
    movieSearchController.sort = 'relevance';
    movieSearchController.sortingRatingSite = 'IMDb';
    movieSearchController.yearOrder = 'Newest First';
    // movieSearchController.movies = ['Empire Strikes Back', 'Return of the Jedi'];

  }));

  it("should return a list of movies when given valid query", function() {
    movieSearchController.searchMovies();
    expect(movieSearchController.movies).toEqual(['Empire Strikes Back', 'Return of the Jedi']);
    expect(movieSearchController.error.noResultFound).toEqual(false);
    expect(movieSearchController.showMovies).toEqual(true);
    expect(movieSearchController.totalResults).toEqual(movieSearchController.movies.length);
  });

});
