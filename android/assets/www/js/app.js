// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'ngCordova', 'ionic.rating', 'ngCordovaOauth'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.cordova && window.cordova.InAppBrowser) {
      window.open = cordova.InAppBrowser.open;
    }

    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.login', {
    url: '/login',
    views: {
      'menuContent': {
        templateUrl: 'templates/login.html'
      }
    }
  })

  .state('app.search', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html',
        controller: 'SearchCtrl'
      }
    }
  })

  .state('app.browse', {
      url: '/browse',
      views: {
        'menuContent': {
          templateUrl: 'templates/browse.html',
          controller: 'HomeCtrl'
        }
      }
    })

  .state('app.playlists', {
    url: '/playlists',
    views: {
      'menuContent': {
        templateUrl: 'templates/playlists.html',
        controller: 'PlaylistsCtrl'
      }
    }
  })

  .state('app.touristics', {
    url: '/touristics',
    views: {
      'menuContent': {
        templateUrl: 'templates/touristics.html',
        controller: 'TouristicCtrl'
      }
    }
  })

  .state('app.events', {
    url: '/events',
    views: {
      'menuContent': {
        templateUrl: 'templates/events.html',
        controller: 'EventsCtrl'
      }
    }
  })

  .state('app.multimedia', {
    url: '/multimedia',
    views: {
      'menuContent': {
        templateUrl: 'templates/multimedia.html',
        controller: 'MultimediaCtrl'
      }
    }
  })

  .state('app.image', {
    url: '/multimedia/:nid',
    views: {
      'menuContent': {
        templateUrl: 'templates/multimedia-single.html',
        controller: 'ImageCtrl'
      }
    }
  })

  .state('app.directories', {
    url: '/directories',
    views: {
      'menuContent': {
        templateUrl: 'templates/directory.html',
        controller: 'DirectoryCtrl'
      }
    }
  })

  .state('app.single', {
    url: '/playlists/:playlistId',
    views: {
      'menuContent': {
        templateUrl: 'templates/playlist.html',
        controller: 'PlaylistCtrl'
      }
    }
  })

  .state('app.touristic', {
    url: '/touristics/:touristicId',
    views: {
      'menuContent': {
        templateUrl: 'templates/touristicD.html',
        controller: 'TouristicDCtrl'
      }
    }
  })

  .state('app.event', {
    url: '/events/:eventId',
    views: {
      'menuContent': {
        templateUrl: 'templates/event.html',
        controller: 'EventCtrl'
      }
    }
  })

  .state('app.directory', {
    url: '/directories/:nid',
    views: {
      'menuContent': {
        templateUrl: 'templates/directory-detail.html',
        controller: 'DirectoryDCtrl'
      }
    }
  })

  .state('app.searchdetail', {
    url: '/search/:nid',
    views: {
      'menuContent': {
        templateUrl: 'templates/search-detail.html',
        controller: 'SearchDCtrl'
      }
    }
  })

  .state('app.favorites', {
    url: '/favorites',
    views: {
      'menuContent': {
        templateUrl: 'templates/favorites.html',
        controller: 'FavoritesCtrl'
      }
    }
  })

  .state('app.account', {
    url: '/account',
    views: {
      'menuContent': {
        templateUrl: 'templates/account.html',
        controller: 'AccountCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/browse');
});
