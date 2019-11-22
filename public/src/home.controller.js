(function () {
'use strict';

angular.module('FlickList')
.controller('HomeController', HomeController);

HomeController.$inject = ['UserService', 'RecommendationService'];
function HomeController (UserService, RecommendationService) {
  var homeCtrl = this;

  homeCtrl.$onInit = function () {
    homeCtrl.username = UserService.getUser();
  };


var sampleMovie = {
  _id: 5da6788b99d3a4650bbfa935
  Title: "Diary of a Wimpy Kid: The Long Haul"
  Year: 2017
  Poster: "https://m.media-amazon.com/images/M/MV5BYmMyZDRlNDktMDVmMS00Mjc2LThkNT..."
  Plot: "A Heffley family road trip to attend Meemaw's 90th birthday party goes..."
  Genre: ["Comedy", "Family"]
  Cast: ["Marsai Martin", "Idara Victor", "Frances Fisher", "Frankie Faison"]
}

  homeCtrl.getRecommendations = function () {
    RecommendationService.getRecommendations(sampleMovie).then(function (response) {
      homeCtrl.getRecommendations = response;
      console.log(response);
      return response;
    });
  };

  homeCtrl.getPopularNow = function () {
    RecommendationService.getPopularNow("2017").then(function (response) {
      homeCtrl.popularNow = response;
      console.log(response);
      return response;
    });
  };
}

})();
