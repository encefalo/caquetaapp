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
  $scope.navTitle = '<img src="img/cabecera.png" class="avatar motion spin fade">';

  $scope.accessToken = $rootScope.accessToken;
  // Open the login modal
  $scope.login = function(){
    $scope.accessToken = $rootScope.accessToken;
    if ($scope.accessToken == undefined){
      $scope.modal.show();
    };
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
              }
    $http(req)
    .success(function(data) {
      $rootScope.accessToken = data.token;
      $rootScope.sessid = data.sessid;
      $rootScope.uid = data.user.uid;
      var alertPopup = $ionicPopup.alert({
          title: 'Inicio de sesión éxitoso',
          template: 'Bienvenido ' + $scope.loginData.username
        });
      $state.go('app.favorites');
      $scope.closeLogin();

    })
    .error(function(data, status) {
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
    console.log($scope.registerData.usuario);
    console.log($scope.registerData.mail);
    if($scope.registerData.pass == $scope.registerData.confirmPass){
      var req = {
                method: 'post',
                url: 'http://caqueta.travel/endpoint/user',
                headers: {
                  'Content-Type': 'application/json'
                },
                    "name"    : $scope.registerData.usuario,
                    "password": $scope.registerData.pass,
                    "mail"    : $scope.registerData.mail
              }
      console.log(req);
      $http(req).success(function(data) {
        var alertPopup = $ionicPopup.alert({
            title: 'Registro éxitoso',
            template: 'Bienvenido ' + $scope.registerData.usuario
          });
        $scope.closeRegister();
      })
      .error(function(data, status) {
        console.log(data);
        var alertPopup = $ionicPopup.alert({
          title: 'Registro fallido',
          template: 'Por favor revisa tus datos'
        });
      });
    }
    // code if using a login system
    $timeout(function() {
      $ionicLoading.hide();
      $scope.closeLogin();
    }, 1000);
  };

  $scope.googleLogin = function(){
    $cordovaOauth.google("657841967825-8q4ba5ko4vpthdn6oavlpncejof954h5.apps.googleusercontent.com",
      ["https://www.googleapis.com/auth/urlshortener",
      "https://www.googleapis.com/auth/userinfo.email"]).then(function(result) {
        console.log(JSON.stringify(result));
    }, function(error) {
        console.log(error);
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
              }
    console.log(req);
    $http(req).success(function(data) {
      var alertPopup = $ionicPopup.alert({
        title: 'Contacto',
        template: 'Su mensaje ha sido enviado correctamente'
      });
    })
    .error(function(data, status) {
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
              }
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
    };
  };
  $scope.favorites = true;
  $scope.favorites = function(titleE, nidE,descriptionE, imageE){
    if($scope.accessToken != undefined){
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
      console.log($scope.favorite);
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

.controller('FavoritesCtrl', function($scope, $http, $rootScope){
  $scope.favorite;
})

.controller('PlaylistsCtrl', function($scope, $http, $cordovaGeolocation) {
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

  $http.get('http://caqueta.travel/endpoint/services-experience',
    {cache:true}).then(function(response){
      $scope.playlists = {};
      $scope.playlists = response.data;
    });
})

.controller('PlaylistCtrl', function($scope, $stateParams, $http, $ionicBackdrop, $ionicModal, $ionicSlideBoxDelegate, $ionicScrollDelegate) {
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

  this.id = $stateParams.playlistId;
  $scope.zoomMin = 1;
  $http.get('http://caqueta.travel/endpoint/services-experience-detail/?args[0]='
    + this.id,
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
    });
})

.controller('EventCtrl', function($scope, $stateParams, $http){
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
  $http.get('http://caqueta.travel/endpoint/services-directory',
    {cache:true}).then(function(response){
      $scope.list = {};
      $scope.list = response.data;
    });
})

.controller('SearchCtrl', function($scope, $http){
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
  $http.get('http://caqueta.travel/endpoint/services-experience',
    {cache:true}).then(function(response){
      $scope.busquedas = {};
      $scope.busquedas = response.data;
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

  this.id = $stateParams.nid;
  console.log(this.id);
  $http.get('http://caqueta.travel/endpoint/node/' + this.id,
    {cache:true}).then(function(response){
      $scope.detail = {};
      $scope.detail = response.data;
    });
})

.controller('DirectoryDCtrl', function($scope, $stateParams, $http){
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
  this.id = $stateParams.nid;
  $http.get('http://caqueta.travel/endpoint/services-directory-detail/?args[0]=' + this.id,
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
