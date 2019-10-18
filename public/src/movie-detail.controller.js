(function () {
"use strict";

angular.module('MovieSearch')
.controller('MovieDetailController', MovieDetailController);

MovieDetailController.$inject = ['movieDetail', '$sce'];
function MovieDetailController (movieDetail, $sce) {
  var movieDetailCtrl = this;

  movieDetailCtrl.movieDetail = movieDetail;
  // movieDetailCtrl.trailerKey = trailerKey;
  // console.log(movieDetailCtrl.trailerKey);
  // movieDetailCtrl.trailerSource = $sce.trustAsResourceUrl("https://www.youtube.com/embed/".concat(trailerKey));
  movieDetailCtrl.trailerAvailable = movieDetailCtrl.movieDetail.Title != undefined
                              && movieDetailCtrl.movieDetail.Year != undefined;
  movieDetailCtrl.trailerSource = $sce.trustAsResourceUrl("https://www.youtube.com/embed?listType=search&list="
    .concat(movieDetailCtrl.movieDetail.Title)
    .concat("+")
    .concat(movieDetailCtrl.movieDetail.Year)
    .concat("+trailer"));

}

})();
