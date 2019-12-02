(function () {
'use strict';

angular.module('FlickList')
.controller('RecommendationController', RecommendationController);

RecommendationController.$inject = ['$scope', '$timeout', 'UserService', 'RecommendationService', 'ListService'];
function RecommendationController ($scope, $timeout, UserService, RecommendationService, ListService) {
  var recommendCtrl = this;

  recommendCtrl.favoritesList = [];
  recommendCtrl.recommendedList = [];
  recommendCtrl.listStarts = [];

  recommendCtrl.$onInit = async function () {
    var favorites_response = await ListService.getListData(UserService.getUser(), "Favorites").then(function (response) {
      recommendCtrl.favoritesList = response.list.slice(0, 3);
      console.log(recommendCtrl.favoritesList);
      return response;
    });

    for (var i = 0; i < recommendCtrl.favoritesList.length; i++) {
      var searchString = recommendCtrl.buildSearchString(recommendCtrl.favoritesList[i]);
      var recommended_response = await RecommendationService.getMoviesByKeyword(searchString).then(function (response) {
        var filteredResponse = response.filter(function (element, index, array) {
          return element.Title != recommendCtrl.favoritesList[i].Title;
        });
        recommendCtrl.recommendedList.push(filteredResponse);
        recommendCtrl.listStarts.push(0);
        return filteredResponse;
      });
    }

    console.log(recommendCtrl.recommendedList);
    console.log(recommendCtrl.listStarts);

  };

  recommendCtrl.buildSearchString = function (movie) {
    var searchString = "";
    searchString = searchString.concat(recommendCtrl.arrayToString(movie.Genre));
    // searchString = searchString.concat(recommendCtrl.arrayToString(movie.Cast));
    searchString = searchString.concat(recommendCtrl.arrayToString(movie.Cast.slice(0, 3)));
    searchString = searchString.concat(recommendCtrl.arrayToString(movie.Directors));
    return searchString;
  };

  recommendCtrl.arrayToString = function (array) {
    var string = "";
    for (var element of array) {
      string = string.concat(element, " ");
    }
    return string;
  };

  recommendCtrl.plotSubstring = function (plotString) {
    if (plotString.length > 100) {
      return plotString.substring(0, 100).concat('...');
    } else {
      return plotString;
    }
  };

  recommendCtrl.incrementListStart = function (listIndex) {
    if (recommendCtrl.listStarts[listIndex] + 3 < recommendCtrl.recommendedList[listIndex].length) {
      $timeout(function () {
        recommendCtrl.listStarts[listIndex]++;
      });
    }
  };

  recommendCtrl.decrementListStart = function (listIndex) {
    if (recommendCtrl.listStarts[listIndex] > 0) {
      $timeout(function () {
        recommendCtrl.listStarts[listIndex]--;
      });
    }
  };

}

})();
