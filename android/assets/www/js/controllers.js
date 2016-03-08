angular.module('starter.controllers', ['ionic', 'ngCordova'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $http, $state,
  $ionicPopup, $rootScope, $ionicLoading){

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data
  $scope.loginData = {};
  $scope.registerData = {};
  $scope.contact = {};
  $scope.message = {};
  $scope.favorite = [];

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });
  // Create the message modal that we will user latter
  $ionicModal.fromTemplateUrl('templates/message.html', {
    scope: $scope
  }).then(function(modalMessage) {
    $scope.modalMessage = modalMessage;
  });
  // Create the message modal that we will user latter
  $ionicModal.fromTemplateUrl('templates/register.html', {
    scope: $scope
  }).then(function(modalRegister) {
    $scope.modalRegister = modalRegister;
  });

  // set the rate and max variables
  $scope.rate = 0;
  $scope.max = 5;

  $scope.$watch('data.rating', function() {
    console.log('New value: '+$scope.data.rating);
  });

  // Triggered in the message modal to close it
  $scope.closeMessage = function() {
    $scope.modalMessage.hide();
  };
  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };
  // Triggered in the login modal to close it
  $scope.closeRegister = function() {
    $scope.modalRegister.hide();
  };
  // Declared header in pages
  $scope.navTitle = '<img src="img/cabecera.png" class="avatar motion spin fade center">';

  $scope.accessToken = $rootScope.accessToken;
  // Open the login modal
  $scope.login = function(){
    $scope.modal.show();
  };

  // Open the register modal
  $scope.register = function(){
    $scope.modalRegister.show();
  };

  // Open the Message modal
  $scope.message = function(){
    $scope.modalMessage.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function(){
    // Setup the loader
    $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 0
    });
    var req = {
                method: 'post',
                url: 'http://caqueta.travel/endpoint/user/login.json',
                headers: {
                  'Content-Type': 'application/json'
                },
                data: { 'username': $scope.loginData.username,
                        'password': $scope.loginData.password
                      }
              };
    $http(req).success(function(data) {
      $rootScope.accessToken = data.token;
      $rootScope.sessid = data.sessid;
      $rootScope.uid = data.user.uid;
      var alertPopup = $ionicPopup.alert({
          title: 'Inicio de sesión éxitoso',
          template: 'Bienvenido ' + $scope.loginData.username
        });
      $state.go('app.favorites');
      $scope.closeLogin();

    }).error(function(data, status) {
      console.log("ERROR: " + data);
      var alertPopup = $ionicPopup.alert({
        title: 'Inicio de sesión fallido',
        template: 'Por favor revisa tus datos'
      });
    });
    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $ionicLoading.hide();
      $scope.closeLogin();
    }, 1000);
  };

  //Perform the register user
  $scope.doRegister = function(){
    // Setup the loader
    $scope.closeLogin();
    $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 0
    });
    if($scope.registerData.pass == $scope.registerData.confirmPass){
      var req = {
                method: 'post',
                url: 'http://caqueta.travel/endpoint/user',
                headers: {
                  'Content-Type': 'application/json'
                },
                    "name"    : $scope.registerData.usuario,
                    "password": $scope.registerData.pass,
                    "mail"    : $scope.registerData.mail,
              };
      $http(req).success(function(data) {
        var alertPopup = $ionicPopup.alert({
            title: 'Registro éxitoso',
            template: 'Bienvenido ' + $scope.registerData.usuario
          });
        $scope.closeRegister();
      }).error(function(data, status) {
        console.log(data);
        var alertPopup = $ionicPopup.alert({
          title: 'Registro fallido',
          template: 'Por favor revisa tus datos'
        });
      });
    }
    // code if using a login system
    $timeout(function(){
      $ionicLoading.hide();
      $scope.closeLogin();
    }, 1000);
  };

  // This method is executed when the user press the "Sign in with Google" button
  $scope.googleSignIn = function() {
    $ionicLoading.show({
      template: 'Logging in...'
    });

    window.plugins.googleplus.login(
      {},
      function (user_data) {
        // For the purpose of this example I will store user data on local storage
        UserService.setUser({
          userID: user_data.userId,
          name: user_data.displayName,
          email: user_data.email,
          picture: user_data.imageUrl,
          accessToken: user_data.accessToken,
          idToken: user_data.idToken
        });

        $ionicLoading.hide();
        $state.go('app.home');
      },
      function (msg) {
        $ionicLoading.hide();
      }
    );
  };
  // This is the success callback from the login method
  var fbLoginSuccess = function(response) {
    if (!response.authResponse){
      fbLoginError("Cannot find the authResponse");
      return;
    }

    var authResponse = response.authResponse;

    getFacebookProfileInfo(authResponse)
    .then(function(profileInfo) {
      // For the purpose of this example I will store user data on local storage
      UserService.setUser({
        authResponse: authResponse,
        userID: profileInfo.id,
        name: profileInfo.name,
        email: profileInfo.email,
        picture : "http://graph.facebook.com/" + authResponse.userID + "/picture?type=large"
      });
      $ionicLoading.hide();
      $state.go('app.home');
    }, function(fail){
      // Fail get profile info
      console.log('profile info fail', fail);
    });
  };

  // This is the fail callback from the login method
  var fbLoginError = function(error){
    console.log('fbLoginError', error);
    $ionicLoading.hide();
  };

  // This method is to get the user profile info from the facebook api
  var getFacebookProfileInfo = function (authResponse) {
    var info = $q.defer();

    facebookConnectPlugin.api('/me?fields=email,name&access_token=' + authResponse.accessToken, null,
      function (response) {
        console.log(response);
        info.resolve(response);
      },
      function (response) {
        console.log(response);
        info.reject(response);
      }
    );
    return info.promise;
  };

  //This method is executed when the user press the "Login with facebook" button
  $scope.facebookSignIn = function() {
    facebookConnectPlugin.getLoginStatus(function(success){
      if(success.status === 'connected'){
        // The user is logged in and has authenticated your app, and response.authResponse supplies
        // the user's ID, a valid access token, a signed request, and the time the access token
        // and signed request each expire
        console.log('getLoginStatus', success.status);

        // Check if we have our user saved
        var user = UserService.getUser('facebook');

        if(!user.userID){
          getFacebookProfileInfo(success.authResponse)
          .then(function(profileInfo) {
            // For the purpose of this example I will store user data on local storage
            UserService.setUser({
              authResponse: success.authResponse,
              userID: profileInfo.id,
              name: profileInfo.name,
              email: profileInfo.email,
              picture : "http://graph.facebook.com/" + success.authResponse.userID + "/picture?type=large"
            });

            $state.go('app.home');
          }, function(fail){
            // Fail get profile info
            console.log('profile info fail', fail);
          });
        }else{
          $state.go('app.home');
        }
      } else {
        // If (success.status === 'not_authorized') the user is logged in to Facebook,
        // but has not authenticated your app
        // Else the person is not logged into Facebook,
        // so we're not sure if they are logged into this app or not.

        console.log('getLoginStatus', success.status);

        $ionicLoading.show({
          template: 'Logging in...'
        });

        // Ask the permissions you need. You can learn more about
        // FB permissions here: https://developers.facebook.com/docs/facebook-login/permissions/v2.4
        facebookConnectPlugin.login(['email', 'public_profile'], fbLoginSuccess, fbLoginError);
      }
    });
  };

  // Perform the login action when the user submits the login form
  $scope.doMessage = function(){
    var req = {
                method: 'post',
                url: 'http://caqueta.travel/endpoint/submission',
                headers: {
                  'Content-Type': 'application/json'
                },
                data: {
                  "webform" : "9d2a5201-eed7-4ce7-9149-4347fa849842",
                  "submission": {
                      "data":{
                          "1":{"values":{"0": $scope.message.nameUser }},
                          "2":{"values":{"0": $scope.message.phone }},
                          "3":{"values":{"0": $scope.message.email }},
                          "4":{"values":{"0": $scope.message.city }},
                          "5":{"values":{"0": $scope.message.body }}
                      }
                  }
                }
              };
    $http(req).success(function(data) {
      var alertPopup = $ionicPopup.alert({
        title: 'Contacto',
        template: 'Su mensaje ha sido enviado correctamente'
      });
    }).error(function(data, status) {
      console.log("ERROR: " + data);
      var alertPopup = $ionicPopup.alert({
        title: 'Contacto',
        template: data
      });
    });
    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };

  $scope.doComment = function(nid){
    this.uid = $rootScope.uid;
    console.log(this.uid);
    $scope.accessToken = $rootScope.accessToken;
    console.log($scope.accessToken);
    if ($scope.accessToken != undefined){
      var req = {
                method: 'post',
                url: 'http://caqueta.travel/endpoint/comment.json',
                headers: {
                  'Content-Type': 'application/json'
                },
                data: { 'subject': '"' + $scope.contact.subject + '"',
                        'comment_body': {
                          "und":[
                              {"value": '"' + $scope.contact.comment + '"'}
                            ]},
                        "nid": nid,
                        "uid": this.uid
                      }
              };
      $http(req).success(function(data) {
        var alertPopup = $ionicPopup.alert({
          title: 'Comentario enviado',
          template: 'Comentario enviado exitosamente'
        });
      })
      .error(function(data, status) {
        var alertPopup = $ionicPopup.alert({
          title: 'Error en comentario',
          template: data
        });
      });
    }else{
      $scope.modal.show();
    }
  };
  //$scope.favorites = true;
  $scope.favorites = function(titleE, nidE,descriptionE, imageE){
    if($scope.accessToken !== undefined){
      $scope.favorite.push({
        title: titleE,
        nid: nidE,
        description:descriptionE,
        image: imageE
      });
      var alertPopup = $ionicPopup.alert({
        title: 'Se agrego un nuevo favorito',
        template: titleE + ' ha sido agregado a sus favoritos'
      });
    }else{
      $scope.modal.show();
    }
  };

  $scope.openLink = function(url){
    window.open(url, '_blank');
  };
})

.controller('HomeCtrl', function($scope, $http){
  $http.get('http://caqueta.travel/endpoint/services-pauta',
    {cache:true}).then(function(response){
      $scope.pauta = {};
      $scope.pauta = response.data[0];
    });
})

.controller('PlaylistsCtrl', function($scope, $http, $cordovaGeolocation) {
  $http.get('http://caqueta.travel/endpoint/services-experience',
    {cache:true}).then(function(response){
      $scope.playlists = {};
      $scope.playlists = response.data;
    });
})

.controller('PlaylistCtrl', function($scope, $stateParams, $http, $ionicBackdrop, $ionicModal, $ionicSlideBoxDelegate, $ionicScrollDelegate) {
  this.id = $stateParams.playlistId;
  $scope.zoomMin = 1;
  $http.get('http://caqueta.travel/endpoint/services-experience-detail/?args[0]=' + this.id,
    {cache:true}).then(function(response){
      $scope.detail = {};
      $scope.detail = response.data[0];
    });

  $http.get('http://caqueta.travel/endpoint/comments-services/?args[0]=' + this.id,{cache:true}).then(function(response){
      $scope.detail.comments = {};
      console.log(response.data[0]);
      $scope.detail.comments = response.data;
    });

  $scope.zoomMin = 1;
  $scope.showImages = function(index) {
    $scope.activeSlide = index;
    $scope.showModal('templates/gallery-zoomview.html');
  };

  $scope.showModal = function(templateUrl) {
    $ionicModal.fromTemplateUrl(templateUrl, {
      scope: $scope
    }).then(function(modal){
      $scope.modal = modal;
      $scope.modal.show();
    });
  };

  $scope.closeModal = function(){
    $scope.modal.hide();
    $scope.modal.remove();
  };

  $scope.updateSlideStatus = function(slide){
    var zoomFactor = $ionicScrollDelegate.$getByHandle('scrollHandle' + slide).getScrollPosition().zoom;
    if (zoomFactor == $scope.zoomMin) {
      $ionicSlideBoxDelegate.enableSlide(true);
    } else {
      $ionicSlideBoxDelegate.enableSlide(false);
    }
  };
})

.controller('TouristicCtrl', function($scope, $http){
  $scope.ratingsObject = {
    iconOn : 'ion-ios-star',
    iconOff : 'ion-ios-star-outline',
    iconOnColor: 'rgb(200, 200, 100)',
    iconOffColor:  'rgb(200, 100, 100)',
    rating:  0,
    minRating:0,
    callback: function(rating) {
      $scope.ratingsCallback(rating);
    }
  };

  $scope.ratingsCallback = function(rating) {
    console.log('Selected rating is : ', rating);
  };
  $scope.pageTitle = '<img src="../img/cabecera.png" with="150px" height="43px">';
  $http.get('http://caqueta.travel/endpoint/services-know',
    {cache:true}).then(function(response){
      $scope.touristics = {};
      console.log(response.data);
      $scope.touristics = response.data;
    });
})

.controller('TouristicDCtrl', function($scope, $stateParams, $http) {
  $scope.ratingsObject = {
    iconOn : 'ion-ios-star',
    iconOff : 'ion-ios-star-outline',
    iconOnColor: 'rgb(200, 200, 100)',
    iconOffColor:  'rgb(200, 100, 100)',
    rating:  0,
    minRating:0,
    callback: function(rating) {
      $scope.ratingsCallback(rating);
    }
  };

  $scope.ratingsCallback = function(rating) {
    console.log('Selected rating is : ', rating);
  };

  this.id = $stateParams.touristicId;
  $http.get('http://caqueta.travel/endpoint/services-know-detail/?args[0]='
    + this.id,
    {cache:true}).then(function(response){
      $scope.detail = {};
      $scope.detail = response.data[0];
    });

  $http.get('http://caqueta.travel/endpoint/comments-services/?args[0]=' + this.id,{cache:true}).then(function(response){
      $scope.detail.comments = {};
      console.log(response.data[0]);
      $scope.detail.comments = response.data;
    });

  $scope.zoomMin = 1;
  $scope.showImages = function(index) {
    $scope.activeSlide = index;
    $scope.showModal('templates/gallery-zoomview.html');
  };


  $scope.showModal = function(templateUrl) {
    $ionicModal.fromTemplateUrl(templateUrl, {
      scope: $scope
    }).then(function(modal){
      $scope.modal = modal;
      $scope.modal.show();
    });
  }

  $scope.closeModal = function(){
    $scope.modal.hide();
    $scope.modal.remove();
  };

  $scope.updateSlideStatus = function(slide){
    var zoomFactor = $ionicScrollDelegate.$getByHandle('scrollHandle' + slide).getScrollPosition().zoom;
    if (zoomFactor == $scope.zoomMin) {
      $ionicSlideBoxDelegate.enableSlide(true);
    } else {
      $ionicSlideBoxDelegate.enableSlide(false);
    }
  };
})

.controller('EventsCtrl', function($scope, $http){
  $scope.ratingsObject = {
    iconOn : 'ion-ios-star',
    iconOff : 'ion-ios-star-outline',
    iconOnColor: 'rgb(200, 200, 100)',
    iconOffColor:  'rgb(200, 100, 100)',
    rating:  0,
    minRating:0,
    callback: function(rating) {
      $scope.ratingsCallback(rating);
    }
  };

  $scope.ratingsCallback = function(rating) {
    console.log('Selected rating is : ', rating);
  };
  $http.get('http://caqueta.travel/endpoint/services-events',
    {cache:true}).then(function(response){
      $scope.events = {};
      $scope.events = response.data;
      console.log(response.data);
    });
})

.controller('EventCtrl', function($scope, $stateParams, $http){
  $scope.ratingsObject = {
    iconOn : 'ion-ios-star',
    iconOff : 'ion-ios-star-outline',
    iconOnColor: 'rgb(200, 200, 100)',
    iconOffColor:  'rgb(200, 100, 100)',
    //rating:  0,
    //minRating:0,
    callback: function(rating) {
      $scope.ratingsCallback(rating);
    }
  };
  $http.get('http://caqueta.travel/endpoint/comments-services/?args[0]=' + this.id,{cache:true}).then(function(response){
      $scope.detail.comments = {};
      console.log(response.data[0]);
      $scope.detail.comments = response.data;
    });
  $scope.ratingsCallback = function(rating) {
    console.log('Selected rating is : ', rating);
  };
  this.id = $stateParams.eventId;
  $http.get('http://caqueta.travel/endpoint/services-events-detail/?args[0]='
    + this.id,
    {cache:true}).then(function(response){
      $scope.detail = {};
      $scope.detail = response.data[0];
    });
})

.controller('MultimediaCtrl', function($scope, $http){
  $http.get('http://caqueta.travel/endpoint/services-multimedia',
    {cache:true}).then(function(response){
      $scope.multimedias = {};
      $scope.multimedias = response.data;
    });
})

.controller('ImageCtrl', function($scope, $stateParams, $http, $ionicModal, $ionicBackdrop, $ionicSlideBoxDelegate, $ionicScrollDelegate){
  this.id = $stateParams.nid;
  $http.get('http://caqueta.travel/endpoint/services-multimedia-detail/?args[0]=' +  this.id,
    {cache:true}).then(function(response){
      $scope.detail = {};
      $scope.detail = response.data[0];
    });
  $scope.zoomMin = 1;
  $scope.showImages = function(index) {
    $scope.activeSlide = index;
    $scope.showModal('templates/gallery-zoomview.html');
  };

  $scope.showModal = function(templateUrl) {
    $ionicModal.fromTemplateUrl(templateUrl, {
      scope: $scope
    }).then(function(modal){
      $scope.modal = modal;
      $scope.modal.show();
    });
  }

  $scope.closeModal = function(){
    $scope.modal.hide();
    $scope.modal.remove();
  };

  $scope.updateSlideStatus = function(slide){
    var zoomFactor = $ionicScrollDelegate.$getByHandle('scrollHandle' + slide).getScrollPosition().zoom;
    if (zoomFactor == $scope.zoomMin) {
      $ionicSlideBoxDelegate.enableSlide(true);
    } else {
      $ionicSlideBoxDelegate.enableSlide(false);
    }
  };
})

.controller('DirectoryCtrl', function($scope, $http){
  $http.get('http://caqueta.travel/endpoint/services-directory',
    {cache:true}).then(function(response){
      $scope.list = {};
      $scope.list = response.data;
    });
  $http.get('http://caqueta.travel/endpoint/comments-services/?args[0]=' + this.id,{cache:true}).then(function(response){
      $scope.detail.comments = {};
      console.log(response.data[0]);
      $scope.detail.comments = response.data;
    });
})

.controller('SearchCtrl', function($scope, $http){
  $http.get('http://caqueta.travel/endpoint/services-experience',
    {cache:true}).then(function(response){
      $scope.busquedas = {};
      $scope.busquedas = response.data;
  });
  $http.get('http://caqueta.travel/endpoint/comments-services/?args[0]=' + this.id,{cache:true}).then(function(response){
      $scope.detail.comments = {};
      console.log(response.data[0]);
      $scope.detail.comments = response.data;
    });
  $scope.zoomMin = 1;
  $scope.showImages = function(index) {
    $scope.activeSlide = index;
    $scope.showModal('templates/gallery-zoomview.html');
  };

  $scope.showModal = function(templateUrl) {
    $ionicModal.fromTemplateUrl(templateUrl, {
      scope: $scope
    }).then(function(modal){
      $scope.modal = modal;
      $scope.modal.show();
    });
  }

  $scope.closeModal = function(){
    $scope.modal.hide();
    $scope.modal.remove();
  };

  $scope.updateSlideStatus = function(slide){
    var zoomFactor = $ionicScrollDelegate.$getByHandle('scrollHandle' + slide).getScrollPosition().zoom;
    if (zoomFactor == $scope.zoomMin) {
      $ionicSlideBoxDelegate.enableSlide(true);
    } else {
      $ionicSlideBoxDelegate.enableSlide(false);
    }
  };
})

.controller('SearchDCtrl', function($scope, $stateParams, $http){

  this.id = $stateParams.nid;
  console.log(this.id);
  $http.get('http://caqueta.travel/endpoint/node/' + this.id,
    {cache:true}).then(function(response){
      $scope.detail = {};
      $scope.detail = response.data;
    });

})

.controller('DirectoryDCtrl', function($scope, $stateParams, $http){
  this.id = $stateParams.nid;
  $http.get('http://caqueta.travel/endpoint/services-directory-detail/?args[0]=' + this.id,
    {cache:true}).then(function(response){
      $scope.detail = {};
      $scope.detail = response.data[0];
    });
  $http.get('http://caqueta.travel/endpoint/comments-services/?args[0]=' + this.id,{cache:true}).then(function(response){
      $scope.detail.comments = {};
      console.log(response.data[0]);
      $scope.detail.comments = response.data;
    });
  $scope.zoomMin = 1;
  $scope.showImages = function(index) {
    $scope.activeSlide = index;
    $scope.showModal('templates/gallery-zoomview.html');
  };

  $scope.showModal = function(templateUrl) {
    $ionicModal.fromTemplateUrl(templateUrl, {
      scope: $scope
    }).then(function(modal){
      $scope.modal = modal;
      $scope.modal.show();
    });
  };

  $scope.closeModal = function(){
    $scope.modal.hide();
    $scope.modal.remove();
  };

  $scope.updateSlideStatus = function(slide){
    var zoomFactor = $ionicScrollDelegate.$getByHandle('scrollHandle' + slide).getScrollPosition().zoom;
    if (zoomFactor == $scope.zoomMin) {
      $ionicSlideBoxDelegate.enableSlide(true);
    } else {
      $ionicSlideBoxDelegate.enableSlide(false);
    }
  };

})

.controller('AccountCtrl', function($scope, $stateParams, $http) {
  $http.get('http://caqueta.travel/endpoint/comment.json',
    {cache:true}).then(function(response){

      if($scope.accessToken != undefined){
        $scope.list = {};
        $scope.list = response.data;
      }else{
        $scope.modal.show();
      }
    });
})

.config(function($ionicConfigProvider) {
  $ionicConfigProvider.tabs.position('bottom');
  $ionicConfigProvider.backButton.text('Atras');
});
