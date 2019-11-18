describe('movie-search-service', function () {

  var movieSearchService;
  var $httpBackend;

  beforeEach(function () {

    module('MovieSearch', ['ui.router']);

    inject(function ($injector) {
      movieSearchService = $injector.get('MovieSearchService');
      $httpBackend = $injector.get('$httpBackend');
    });

    it('should return a list of titles by relevance', function () {
      $httpBackend.whenGet('http://localhost:8080/movies/title/star wars/imdbVotes/-1')
        .respond(['New Hope', 'Empire Strikes Back', 'Return of the Jedi']);

      movieSearchService.searchMoviesByType('Star Wars', 'Title', 'imdbVotes').then(function (response) {
        expect(response.data).toEqual(['New Hope', 'Empire Strikes Back', 'Return of the Jedi']);
      });

      $httpBackend.flush();

    });

  });

});
