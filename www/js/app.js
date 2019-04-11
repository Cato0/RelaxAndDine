// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

angular.module('starter', ['ionic', 'starter.controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    
    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html'

  })
  
  .state('back', {
    url: '/back',
    abstract: true,
    templateUrl: 'templates/back.html'

  })
	
  .state('app.home', {
    url: '/home',
	views: {
		'menuContent': {
			templateUrl: 'templates/home.html',
			controller: 'ListCtrl'
		}
	}
  })
  
    .state('app.list', {
    url: '/list',
	views: {
		'menuContent': {
    templateUrl: 'templates/list.html',
	controller: 'ListCtrl',
	directive: 'Directive.html'
		}
	}
  })
  
  .state('app.map', {
    url: '/map',
		views: {
		'menuContent': {
			templateUrl: 'templates/map.html',
			controller: 'MapCtrl'
			}
		}
	
  })
 
  .state('app.info', {
		url: '/info',
		views: {
			'menuContent': {
				templateUrl: 'templates/info.html',
				controller: 'infoCtrl'
			}
		}
   })
 
  .state('app.configurations', {
		url: '/config',
		views: {
			'menuContent': {
				templateUrl: 'templates/configurations.html',
				controller: 'configurationsCtrl'
			}
		}
   })
 
  $urlRouterProvider.otherwise("/app/list");
 
});