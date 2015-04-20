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

  this.login_with_google = function () {
    $scope.authData = null;
    $scope.error = null;

    auth.$authWithOAuthPopup('google', {scope: ['profile']}).then(function (authData) {
      $scope.authData = authData;
    }).catch(function(error) {
      $scope.error = error;
    });
  };

  this.login_with_twitter = function () {
    $scope.authData = null;
    $scope.error = null;

    auth.$authWithOAuthPopup('twitter').then(function (authData) {
      $scope.authData = authData;
    }).catch(function(error) {
      $scope.error = error;
    });
  };

  this.login_with_facebook = function () {
    $scope.authData = null;
    $scope.error = null;

    auth.$authWithOAuthPopup('facebook', {scope: ['public_profile']}).then(function (authData) {
      $scope.authData = authData;
      console.table(authData.facebook.cachedUserProfile);
    }).catch(function(error) {
      $scope.error = error;
    });
  };
  
});