var app = angular.module('xmas-2015', ['firebase']);
return


app.controller('MainController', function ($scope, $firebaseArray) {
	var ref = new Firebase('https://xmas-2015.firebaseio.com/cards');

	$scope.cards = $firebaseArray(ref);
});


app.controller('AvatarController', function ($scope) {
  $scope.$watch('name', function (name) {
    if (name) {
      var pattern = Trianglify({
          width: 600, 
          height: 600,
          seed: name
      });
      $scope.avatar.url = pattern.png();
    } else {
      $scope.avatar = {};
    }
  });

  $scope.avatar = {};
});

app.factory('Avatar', function () {


  return {};
});


app.controller('AuthController', function ($scope, $firebaseAuth) {
  var ref = new Firebase('https://xmas-2015.firebaseio.com/');
  var auth = $firebaseAuth(ref);

  $scope.person = {};

  this.login_with_google = function () {
    $scope.error = null;

    auth.$authWithOAuthPopup('google', {scope: ['profile']}).then(function (auth_data) {
      $scope.person.name = auth_data.google.displayName;
      $scope.person.picture_url = auth_data.google.cachedUserProfile.picture;
    }).catch(function(error) {
      $scope.error = error;
    });
  };

  this.login_with_twitter = function () {
    $scope.auth_data = null;
    $scope.error = null;

    auth.$authWithOAuthPopup('twitter').then(function (auth_data) {
      $scope.person.name = auth_data.twitter.displayName;
      $scope.person.picture_url = auth_data.twitter.cachedUserProfile.profile_image_url_https;
    }).catch(function(error) {
      $scope.error = error;
    });
  };

  this.login_with_facebook = function () {
    $scope.error = null;

    auth.$authWithOAuthPopup('facebook', {scope: ['public_profile']}).then(function (auth_data) {
      $scope.person.name = auth_data.facebook.displayName;
      $scope.person.picture_url = auth_data.facebook.cachedUserProfile.picture.data.url;
    }).catch(function(error) {
      $scope.error = error;
    });
  };
  
});