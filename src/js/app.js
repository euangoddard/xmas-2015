var app = angular.module('xmas-2015', ['firebase']);


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

app.controller('AuthController', function ($scope, $firebaseAuth) {
  var ref = new Firebase('https://xmas-2015.firebaseio.com/');
  var auth = $firebaseAuth(ref);

  var build_authenticator = function (service_name, service_params) {
    return function () {
      auth.$authWithOAuthPopup(service_name, service_params)
        .then(set_authenticated_user)
        .catch(set_authentication_error);
    };
  };

  this.login_with_google = build_authenticator('google', {scope: ['profile']});

  this.login_with_twitter = build_authenticator('twitter', {});

  this.login_with_facebook = build_authenticator('facebook', {scope: ['public_profile']});

  var set_authenticated_user = function (auth_data) {
    $scope.error = null;
    switch (auth_data.provider) {
      case 'google':
        $scope.person.name = auth_data.google.displayName;
        $scope.person.picture_url = auth_data.google.cachedUserProfile.picture;
        break;
      case 'facebook':
        $scope.person.name = auth_data.facebook.displayName;
        $scope.person.picture_url = auth_data.facebook.cachedUserProfile.picture.data.url;
        break;
      case 'twitter':
        $scope.person.name = auth_data.twitter.displayName;
        $scope.person.picture_url = auth_data.twitter.cachedUserProfile.profile_image_url_https;
        break;
      default:
        throw new Error('Unknown authentication provider: ' + auth_data.provider);
    }
  };

  var set_authentication_error = function (error_message) {
    $scope.person = {};
    $scope.error = error;
  };

  $scope.person = {};
  $scope.error = null;
  (function () {
    var auth_data = auth.$getAuth();
    if (auth_data) {
      set_authenticated_user(auth_data);
    }
  }());
  
});