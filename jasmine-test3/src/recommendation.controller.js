(function () {
'use strict';

angular.module('FlickList')
.controller('RecommendationController', RecommendationController);

RecommendationController.$inject = ['UserService', 'RecommendationService', 'ListService'];
function RecommendationController (UserService, RecommendationService, ListService) {
  var recommendCtrl = this;

  // var sampleMovie = {
  //   _id: 5da6788b99d3a4650bbfa935
  //   Title: "Diary of a Wimpy Kid: The Long Haul"
  //   Year: 2017
  //   Poster: "https://m.media-amazon.com/images/M/MV5BYmMyZDRlNDktMDVmMS00Mjc2LThkNT..."
  //   Plot: "A Heffley family road trip to attend Meemaw's 90th birthday party goes..."
  //   Genre: ["Comedy", "Family"]
  //   Cast: ["Marsai Martin", "Idara Victor", "Frances Fisher", "Frankie Faison"]
  // }
  //
  //   recommendCtrl.getRecommendations = function () {
  //     RecommendationService.getRecommendations(sampleMovie).then(function (response) {
  //       recommendCtrl.getRecommendations = response;
  //       console.log(response);
  //       return response;
  //     });
  //   };

}

})();
