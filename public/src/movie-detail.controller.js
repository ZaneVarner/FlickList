(function () {
"use strict";

angular.module('MovieSearch')
.controller('MovieDetailController', MovieDetailController);

MovieDetailController.$inject = ['movieDetail', '$scope', '$timeout', '$sce', 'ListService', 'RatingReviewService', 'UserService'];
function MovieDetailController (movieDetail, $scope, $timeout, $sce, ListService, RatingReviewService, UserService) {
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

  movieDetailCtrl.userLists = [];
  movieDetailCtrl.customLists = [];

  movieDetailCtrl.currentReviews = [];
  movieDetailCtrl.currentRating = null;

  movieDetailCtrl.$onInit = async function () {
    // IMDb ID of the current movie
    var imdbID = movieDetailCtrl.movieDetail.imdbID;
    var user = UserService.getUser();

    /*
      GATHER THE USER LIST DATA
    */

    const user_list_response = await ListService.getUserLists(user).then(function (response) {
      movieDetailCtrl.userLists = response;
      for (var list in response) {
        if (response[list].listName != 'Watch List' && response[list].listName != 'Watched' && response[list].listName != 'Favorites') {
          movieDetailCtrl.customLists.push(response[list]);
        }
      }

      return response;
    });

    // Store default lists for accessibility
    movieDetailCtrl.defaultLists = {};
    movieDetailCtrl.defaultLists.watchList = movieDetailCtrl.userLists.find(list => list.listName == 'Watch List');
    movieDetailCtrl.defaultLists.watched = movieDetailCtrl.userLists.find(list => list.listName == 'Watched');
    movieDetailCtrl.defaultLists.favorites = movieDetailCtrl.userLists.find(list => list.listName == 'Favorites');

    movieDetailCtrl.selectedAddListName = 'Watch List';
    movieDetailCtrl.selectedAddList = movieDetailCtrl.defaultLists.watchList;
    movieDetailCtrl.positionSelect = '1';

    /*
      GATHER ALL OF THE REVIEW DATA
    */

    // Gather all of the reviews from the database
    const review_response = await RatingReviewService.getReviewsForMovie(imdbID).then(function (response) {
      movieDetailCtrl.currentReviews = response;
      return response;
    });

    // Get the average rating from the database
    const rating_avg_response = await RatingReviewService.getRating(imdbID).then(function (response) {
      movieDetailCtrl.currentRating = response.rating_avg;
      return response;
    });

    // Get the current user
    var user = UserService.getUser();

    // Get the user's current review if it exists
    const user_review_response = await RatingReviewService.getUserReviewForMovie(imdbID, user).then(function (response) {
      if (response) {
        movieDetailCtrl.userRating = response.rating.toString();
        movieDetailCtrl.userReviewHeadline = response.headline;
        movieDetailCtrl.userReview = response.review;
      }
      return response;
    });
  };

  // This method gets the selected list based on selected list name
  movieDetailCtrl.selectListToAddMovie = function () {
    $timeout(function () {
      movieDetailCtrl.selectedAddList = movieDetailCtrl.userLists.find(list => list.listName == movieDetailCtrl.selectedAddListName);
      movieDetailCtrl.positionSelect = '1';
    });
  };

  // This method adds the chosen movie to the chosen list at the chosen position
  movieDetailCtrl.addToList = async function () {
    var user = UserService.getUser();
    var listName = movieDetailCtrl.selectedAddListName;
    var imdbID = movieDetailCtrl.movieDetail.imdbID;

    // Get the movie from the database to add to the list
    const movie_response = await ListService.getMovieByID(imdbID).then(function (response) {
      return response;
    });

    // If movie is already in the list, remove it
    var newList = movieDetailCtrl.selectedAddList.list.filter(function (value, index, arr) {
      return value.imdbID != movie_response.imdbID;
    });

    // Insert the new movie into the new list
    newList.splice(parseInt(movieDetailCtrl.positionSelect) - 1, 0, movie_response);

    // Get the old list document
    var get_response = await ListService.getListData(user, listName).then(function (response) {
      return response;
    });

    console.log(get_response);
    console.log(get_response.list);
    console.log(newList);

    // Delete the old list document
    var delete_response = await ListService.deleteList(get_response._id).then(function (response) {
      return response;
    });

    // Post the new list document
    var post_response = await ListService.postList(user, listName, newList).then(function (response) {
      return response;
    });

  };

  movieDetailCtrl.postRatingReview = async function () {
    // Get the information to post the review
    var imdbID = movieDetailCtrl.movieDetail.imdbID;
    var user = UserService.getUser();
    var rating = parseInt(movieDetailCtrl.userRating);
    var headline = movieDetailCtrl.userReviewHeadline;
    var review = movieDetailCtrl.userReview;

    // Variales for average rating calculation
    var new_count;
    var new_avg;

    // Gets the user's current review of the movie
    const user_review_response = await RatingReviewService.getUserReviewForMovie(imdbID, user).then(function (response) {
      return response;
    });

    // Delete the user's current review for the movie if it exists
    const delete_review_response = await RatingReviewService.deleteReviewForMovie(user_review_response._id).catch(function (failure) {
      return null;
    });

    // Post the new review
    const post_review_response = await RatingReviewService.postReview(imdbID, user, rating, headline, review).then(function (response) {
      return response;
    });

    // Retrieve the updated list of reviews
    const reviews_response = await RatingReviewService.getReviewsForMovie(imdbID).then(function (response) {
      $timeout(function () {
        movieDetailCtrl.currentReviews = response;
      });
      return response;
    });

    // Get the current rating score for the movie
    const current_rating_response = await RatingReviewService.getRating(imdbID).then(function (response) {
      if (response) {
        if (user_review_response) {
          new_count = response.rating_count;
          var old_total = response.rating_count * response.rating_avg;
          var new_total = old_total - user_review_response.rating + rating;
          new_avg = new_total / new_count;
        } else {
          new_count = response.rating_count + 1;
          var old_total = response.rating_count * response.rating_avg;
          var new_total = old_total + rating;
          new_avg = new_total / new_count;
        }
      } else {
        new_count = 1;
        new_avg = rating;
      }
      return response;
    });

    // Delete the current rating score document if it exists
    const delete_rating_response = await RatingReviewService.deleteRating(current_rating_response._id).catch(function (failure) {
      return null;
    });

    // Post the new rating score for the movie
    const post_rating_response = await RatingReviewService.postRating(imdbID, new_count, new_avg).then(function (response) {
      return response;
    });

    // Gets the new updated rating score
    const new_rating_response = await RatingReviewService.getRating(imdbID).then(function (response) {
      $timeout(function () {
        movieDetailCtrl.currentRating = response.rating_avg;
      });
      return response;
    });


  };

  // Determines the color of the review containers based on rating
  movieDetailCtrl.borderType = function (rating) {
    if (rating < 3.5) {
      return 'border-danger';
    } else if (rating < 7.5) {
      return 'border-warning';
    } else {
      return 'border-success';
    }
  };

  // Rounds a rating to 2 decimal places
  movieDetailCtrl.roundRating = function (rating) {
    return Math.round(rating * 100) / 100;
  };

}

})();
