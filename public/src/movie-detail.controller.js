(function () {
"use strict";

angular.module('MovieSearch')
.controller('MovieDetailController', MovieDetailController);

MovieDetailController.$inject = ['movieDetail', '$sce'];
function MovieDetailController (movieDetail, $sce) {
  var movieDetailCtrl = this;

  movieDetailCtrl.movieDetail = movieDetail;

  movieDetailCtrl.netflixURL = 'https://www.netflix.com/search?q='
    .concat(movieDetailCtrl.movieDetail.Title.replace(/[^A-Za-z0-9]/g, ' ').replace(/\s+/g,'%20').trim());

  movieDetailCtrl.primeVideoURL = 'https://www.amazon.com/s?k='
    .concat(movieDetailCtrl.movieDetail.Title.replace(/[^A-Za-z0-9]/g, ' ').replace(/\s+/g,'+').trim())
    .concat('+').concat(movieDetailCtrl.movieDetail.Year)
    .concat('&i=instant-video&ref=nb_sb_noss');

  movieDetailCtrl.youtubeURL = 'https://www.youtube.com/results?search_query='
    .concat(movieDetailCtrl.movieDetail.Title.replace(/[^A-Za-z0-9]/g, ' ').replace(/\s+/g,'+').trim())
    .concat('+').concat(movieDetailCtrl.movieDetail.Year)
    .concat('+full+movie');


  movieDetailCtrl.trailerAvailable = movieDetailCtrl.movieDetail.Title != undefined
                              && movieDetailCtrl.movieDetail.Year != undefined;
  movieDetailCtrl.trailerSource = $sce.trustAsResourceUrl("https://www.youtube.com/embed?listType=search&list="
    .concat(movieDetailCtrl.movieDetail.Title)
    .concat("+")
    .concat(movieDetailCtrl.movieDetail.Year)
    .concat("+trailer"));

}

})();
