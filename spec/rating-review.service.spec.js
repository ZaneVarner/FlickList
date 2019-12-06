describe('RatingReviewService', function () {

  var ratingReviewService;
  var $httpBackend;


  beforeEach(function () {
    module('FlickList');
    angular.module('firebase', [])
    angular.module('MovieSearch', [])

    inject(function ($injector) {
      ratingReviewService = $injector.get('RatingReviewService');
      $httpBackend = $injector.get('$httpBackend');
    });

  });

  it('should return a movie correctly by IMDb ID', function () {
    $httpBackend.whenGET('http://localhost:8080/movies/tt0111161')
      .respond('The Shawshank Redemption');
    ratingReviewService.getReviewsForMovie('tt0111161').then(function (response) {
      expect(response).toEqual('The Shawshank Redemption');
    });
    $httpBackend.flush();
  });

  it('should return a list of titles by IMDb rating', function () {
    $httpBackend.whenGET('http://localhost:8080/movies/title/test/imdbRating/-1')
      .respond(['Empire Strikes Back', 'Return of the Jedi']);
    movieSearchService.searchMoviesByType('test', 'Title', 'imdbRating').then(function (response) {
      expect(response).toEqual(['Empire Strikes Back', 'Return of the Jedi']);
    });
    $httpBackend.flush();
  });

  it('should return a list of titles by Rotten Tomatoes rating', function () {
    $httpBackend.whenGET('http://localhost:8080/movies/title/test/rottenTomatoesRating/-1')
      .respond(['Empire Strikes Back', 'Return of the Jedi']);
    movieSearchService.searchMoviesByType('test', 'Title', 'rottenTomatoesRating').then(function (response) {
      expect(response).toEqual(['Empire Strikes Back', 'Return of the Jedi']);
    });
    $httpBackend.flush();
  });

  it('should return a list of titles by Metacritic rating', function () {
    $httpBackend.whenGET('http://localhost:8080/movies/title/test/metacriticRating/-1')
      .respond(['Empire Strikes Back', 'Return of the Jedi']);
    movieSearchService.searchMoviesByType('test', 'Title', 'metacriticRating').then(function (response) {
      expect(response).toEqual(['Empire Strikes Back', 'Return of the Jedi']);
    });
    $httpBackend.flush();
  });

});

describe('MovieSearchService', function () {

  var movieSearchService;
  var $httpBackend;


  beforeEach(function () {
    module('MovieSearch');

    inject(function ($injector) {
      movieSearchService = $injector.get('MovieSearchService');
      $httpBackend = $injector.get('$httpBackend');
    });

  });

  it('should return the correct details for selected movie', function () {
    $httpBackend.whenGET('https://www.omdbapi.com/?i=tt0111161&plot=full&apikey=44664e4')
      .respond('Shawshank Redemption');
    movieSearchService.getMovieDetail('tt0111161').then(function (response) {
      expect(response).toEqual('Shawshank Redemption');
    });
    $httpBackend.flush();
  });



});
