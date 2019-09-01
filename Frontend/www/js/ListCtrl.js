//app = angular.module('starter.controllers' , ['ngCordova'])


app.run(function($ionicPlatform, $cordovaDevice,$cordovaDialogs ,$cordovaLocalNotification) {
  $ionicPlatform.ready(function() {
	if(window.cordova && window.cordova.plugins.Keyboard) {
	  cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

	  console.log("rdy");
	  console.log(cordova);


	}
	if(window.StatusBar) {
	  StatusBar.styleDefault();
	}

    // unecessary "if", I know, just testing
    if(ionic.Platform.isReady){
      console.log("DEBUGGING: Cordova Device " + $cordovaDevice.getCordova());
      $cordovaDialogs.alert("Ionic is ready");

	//$cordovaLocalNotification.update();

	$cordovaLocalNotification.isScheduled("1234").then(function() {
		console.log("isScheduled");
	});

    }
});
});


app.controller('ListCtrl', function ($scope, $state, variables, factory1, service1, $ionicModal, $timeout, $rootScope, $ionicScrollDelegate, $http, $cordovaPushV5, $cordovaLocalNotification) {

  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });





/*var push = PushNotification.init({
  	android: {
  		senderID: "123"
  	},
  	browser: {
  		pushServiceURL: 'http://push.api.phongap.com/v1/push'
  	},
  	ios: {
  		alert: "true",
  		badge: "true",
  		sound: "true"
  	},
  	windows: {}
  });*/




/*  push.on('registration' , function(data) {
  		data.registrationId: "123"
  });

  push.on('notification', function(data) {
  	data.message: "asd"
  });

  push.on('error', function(e) {
  	//e.message: "error"
  });*/

	//$scope.maxNumberOfRestaurants = 20; 		// maximum number of displayed restaurants in the List

	//$scope.maxDistance = 1000*1000;				// shows only restaurants in this Distance in m
	$scope.localUpdateInterval = 3*1000; 		// in milliseconds
	$scope.globalUpdateInterval = 5*1000;	//120	// makes complete update + google request		1*60 vorher!!
	//$scope.mapMatchingComparisonCount = 3; 		// How many near Positions should be compared, to find the correct one
	$scope.localInterval;						// Interval for the localUpdates
	$scope.tempData = [];						// all Restaurants in the Air-Distance-Radius, that in form of restaurant-Objects; restaurants which have too large of an maxDistanceBetweenHighwayAndDestination-Value are thrown; out reloads after global update
	$scope.restaurants = [];					// only all shown Restaurants in the List, limited by maxSearchDistance and maxNumberOfRestaurants
	//$scope.sortBy = 'firstStep';				// distance || duration || firstStep		
	//$scope.platform = 'Device';				// Currently used platform (only differences for Android/IOS)
	$scope.firstImage ='/1_640x480.jpg';		// Ending of all First Images that are shown in the List
	$scope.currentPosition;						// Current GPS Position
	//$scope.previousPosition;					// Position before Current Position
	//$scope.previousPosition2;					// Position before Previous Position
	$scope.previousPositions = [];				// 0 = last Position; 1 = before Last Position ...
	$scope.mapMatchingAccuracy = 7; 			// count says how many previous positions should be saved for the map Matching; increases the accuracy of the current Position
	$scope.mapMatchingRadius = 20;
	$scope.mapMatchingConfidenceThreshold = 0.5;
	$scope.previousStreetName;
	//$scope.distanceBetweenUpdates;
	//$scope.previousDistanceBetweenUpdates;
	$scope.fac1 = factory1;
	$scope.offRampPromises = [];
	$scope.restaurantCount;
	//$scope.highwayToDestination = [];


 /*	console.log(PushNotification);*/


	$scope.option1 = {
	    id: "1234",
        date: new Date(),
        message: "Ein neues Restaurant in Ihrer Nähe",
        title: "Restaurant gefunden!",
        autoCancel: true,
        sound: null
	};

	$scope.dirFuncs = {};						// Can call specific directive Functions that are inside this object

	var pushOptions = {
	    android: {
	        senderID: "1234567890",
	        icon: "push_icon",
	        iconColor: "#FFF"
	    },
	    ios: {
	        alert: true,
	        badge: true,
	        sound: true
	    }
	};

	// Standart Settings for the first use
	if(!localStorage.orderBy) {

		localStorage.maxSearchDistance 							= 100;
		localStorage.maxDistanceBetweenHighwayAndDestination 	= 50;
		localStorage.maxNumberOfRestaurants 					= 3;
		localStorage.orderBy									= 'Abfahrt';
	}

	if (ionic.Platform.isAndroid() == true) {
		variables.setDevice('Android');
	} else if (ionic.Platform.isIOS() == true) {
		variables.setDevice('IOS');
		
	} else {
		variables.setDevice('Browser');
	}
	
	// change style for Android of IOS
	switch (variables.getDevice()) {
		
		case 'Android':
			break;
		case 'IOS':
		
			var content = document.getElementById("content");
			var ionScroll = document.getElementById("ionScroll");
			
			ionScroll.style.height = '85vh';
			content.style.marginTop = '10px'; content.className += " padding-top";
			break;
		default: 
			break;
	}
	

/*	
	$cordovaPushV5.initialize(options).then(function() {
		$cordovaPushV5.onNotivication();
		$cordovaPushV5.onError();

		$cordovaPushV5.register().then(function(registrationId) {
			$scope.registrationId = registrationId;
		})
	});
*/
/*	$rootScope.$on('$cordovaPushV5:errorOccured', function(event, e) {
		console.log(e.message);
	});*/


/*	console.log($cordovaLocalNotification);
	console.log($cordovaPushV5);
	var alarmTime = new Date();
        alarmTime.setMinutes(alarmTime.getMinutes() + 1);*/

/*	$cordovaLocalNotification.add({
            id: "1234",
            date: alarmTime,
            message: "This is a message",
            title: "This is a title",
            autoCancel: true,
            sound: null
		id: 1,
		title: "Message Title",
		firstAt: date, // firstAt and at properties must be an IETF-compliant RFC 2822 timestamp
	    every: "day", // this also could be minutes i.e. 25 (int)
	    data: { meetingId:"123#fg8" }
	}).then(function() {
		alert("notification");
	});*/

	//$cordovaLocalNotification.update();

/*	$cordovaLocalNotification.isScheduled("1234").then(function(isScheduled) {

		alert("Notification 1234 isScheduled: " + isScheduled);
	});
*/

	$scope.globalUpdate = function() {	// 1. getDataFromDatabase, 2. start localUpdate - Interval

		//$cordovaLocalNotification.add($scope.option1, $scope);

		//console.log($cordovaLocalNotification.schedule);

		$cordovaLocalNotification.schedule($scope.option1);

		$scope.tempData = [];
		
		if ( factory1.getCurrentPosition() ) {
		
			factory1.getDataFromDatabase($scope.tempData, variables.getMaxSearchDistance(), (function() {				
					
					//console.log($scope.restaurantCount + " " + $scope.tempData.length);

					if($scope.restaurantCount && $scope.tempData.length > $scope.restaurantCount) {
						//$cordovaLocalNotification.add($scope.option1);
					}

					$scope.restaurantCount = $scope.tempData.length;

					// clear Interval, so it only runs once
					if ($scope.localInterval) {
						clearInterval($scope.localInterval);
					}			
					
				// if no restaurant is found, restart the search with a bigger radius (+1km), until at least 1 is found
				if($scope.tempData.length === 0 && localStorage.maxSearchDistance < 1000) {
					
					variables.setMaxSearchDistance(variables.getMaxSearchDistance()+1000);
					$scope.globalUpdate();
				}
				else {
					// Start localUpdate once before the wait of the interval
					$scope.currentPosition = factory1.getCurrentPosition();							
					$scope.previousPositions[0] = JSON.parse(JSON.stringify($scope.currentPosition));

					// Dont do the complete localUpdate at the first Iteration -> this way it shows the results faster
					getAllRoutePromises().then(function() {
						sortArray($scope.tempData);
						$scope.restaurants = $scope.tempData;
					});

					// Starts updating the values on the ListPage after each interval			
					startLocalInterval();
				}		
			})
		);	// END getDataFromDatabase
		} else {
			console.log("else");
			$scope.globalUpdate();
		}	
	};	// END globalUpdate
	
	// update current Position, the 3 Values and new sorting every couple of seconds
	var localUpdate = function () {

		mapMatching()	 			 				// updates current Position
			.then(getAllRoutePromises)				// updates 3 Values
			.then( (res) => modifyList(res));		// makes any necessary changes to the List, like sorting or change of color and size
	};

	var startLocalInterval = function () {
		
		$scope.localInterval = setInterval(function() {
			
			localUpdate();
			
		} , $scope.localUpdateInterval);		
	};

	// Sorts the List, and throws out all 
	var modifyList = function (res) {

		return new Promise(function(resolve, reject) {

		 		sortArray($scope.tempData);
		 	 	limitForMaxDistanceBetweenHighwayAndDestination(res);

		 	 	Promise.all($scope.offRampPromises).then( () => {

			 		$scope.restaurants = $scope.tempData.slice(0,variables.getMaxNumberOfRestaurants());

			 		// change image src for all nextDirections (Top-Right)

					if($scope.dirFuncs.changeDirectionImages) {		
						for (var i = 0; i < $scope.restaurants.length; i++) {
								$scope.dirFuncs.changeDirectionImages(i, $scope.restaurants[i].maneuver.modifier, $scope.restaurants[i].maneuver.type);
								$scope.dirFuncs.buildStars(i, $scope.restaurants[i].rating);
						}
					}
				 });

			resolve();
		}).then(function() { checkNumbers(); });
	};

	// updates the 3 values on view (Distance, Duration and Step[0] )
	var getAllRoutePromises = function () {

			return new Promise(function(resolve, reject) {

			var routePromises = [];

			for (i = 0; i < $scope.tempData.length; i++) {	
					routePromises.push(service1.getRoutePromise($scope.currentPosition.latitude, $scope.currentPosition.longitude,
																$scope.tempData[i].position.coordinates[0], $scope.tempData[i].position.coordinates[1]));
			}

			// After all promises/routings are done, put in the 3 updated values for distance, duration, firstStep
			Promise.all(routePromises).then((values)=> {

				for (var j = values.length-1; j >= 0; j--) {	

						$scope.tempData[j].distance = (values[j].data.distance / 1000).toFixed(1);
						$scope.tempData[j].duration = (values[j].data.duration / 60).toFixed(0);
						$scope.tempData[j].step.distance.value = (values[j].data.firstStep / 1000).toFixed(2);
						$scope.tempData[j].maneuver = values[j].data.maneuver;
				}
					resolve(values);
				});				
			});
	};

	// checks the last Positions and does the mapMatching function from the OSRM-Library to get a better result for the current Position
	var mapMatching = function () {	// (mapMatchingRadius, mapMatchingConfidenceThreshold)

		return new Promise(function(resolve, reject) {

			if($scope.previousPositions[0]) {

				service1.getMapMatching($scope.previousPositions, $scope.mapMatchingRadius).then((resp) => {

					$scope.currentPosition.latitude = resp.latitude;
					$scope.currentPosition.longitude = resp.longitude;

					// updates previous Positions for next iteration
					if(differenceIsHighEnough($scope.previousPositions[0], $scope.currentPosition)) {

						for (var i = $scope.mapMatchingAccuracy-1; i > 0; i--) {
							if ($scope.previousPositions[i-1]) {
								
								$scope.previousPositions[i] = JSON.parse(JSON.stringify(($scope.previousPositions[i-1])));
							}
						}
						$scope.previousPositions[0] = JSON.parse(JSON.stringify(($scope.currentPosition)));
					}
						//alert($scope.previousPositions.length);
						// Ausgabe					
/*										
						for(var k = 0; k < $scope.previousPositions.length; k++) {
							console.log("P"+k + ": (" + $scope.previousPositions[k].latitude + "," + $scope.previousPositions[k].longitude+")");
						}
						console.log("----------");
*/
					resolve();
				});
			}
		});
	};

	var differenceIsHighEnough = function (position1, position2) {


		var distance = factory1.calculateAirDistance(position1.latitude, position1.longitude, position2.latitude, position2.longitude);
		var maxDistance = 0.005; // 0.005 = 5 meter

		if(distance > maxDistance) {
			return true;
		}
		else if (distance < (-1*maxDistance)){
			return true;
		}
		else {return false;}
	};

	// if the distance between off-ramp and destination is too long, delete it from tempData	// for maxDistanceBetweenHighwayAndDestination
	var limitForMaxDistanceBetweenHighwayAndDestination = function (values) {	// Values have to be the Route Promises for all Restaurants

		$scope.offRampPromises = [];

		for(var i = values.length-1; i >= 0; i--) {

			var offRampPosition = values[i].data.offRampPosition;
			var destination = [$scope.tempData[i].position.coordinates[0]  ,$scope.tempData[i].position.coordinates[1] ];

			if(offRampPosition) {
				$scope.offRampPromises.push(service1.getRoutePromise(offRampPosition.latitude, offRampPosition.longitude, destination[0], destination[1]).then((res) => {
					if( res.data.distance > variables.getMaxDistanceBetweenHighwayAndDestination() ) {						
						$scope.tempData.splice(i, 1);
					}
				}));
			}
		}
	};

	// changes color and size of the 3 numbers on the screen if necessary
	var checkNumbers = function () {

			var dist = document.getElementsByClassName('textDistance');
			var dur = document.getElementsByClassName('textDuration');
			var step = document.getElementsByClassName('nextStepText');
			
			// set fontSize smaller, when the number gets too large for the screen
			for (var k = 0; k < $scope.restaurants.length; k++) {
				
				// Change Font Size
				if($scope.restaurants[k].distance > 99) {					
					if(dist[k]) 
					dist[k].style.fontSize = '70%';
					
				} else {
					if(dist[k])
					dist[k].style.fontSize = '100%';
				}
				if ($scope.restaurants[k].duration > 99) {
					
					if(dur[k])
					dur[k].style.fontSize = '70%';
				} else {
					if(dur[k])
					dur[k].style.fontSize = '100%';
				}
				if ($scope.restaurants[k].step.distance.value > 9) {
					
					if(step[k])
					step[k].style.fontSize = '70%';
				} else {
					if(step[k])
					step[k].style.fontSize = '100%';
				}
				
				// Change Color
				if ($scope.restaurants[k].step.distance.value < 0.5) {
					
					if(step[k]) {
						step[k].style.color = 'red';
					} 
				
				} else {
						step[k].style.color = 'black';
				}
			}	
	};
	
	// sort an array full of restaurant objects by the given Attribute in $scope.sortBy
	var sortArray = function(array) {

		switch (localStorage.orderBy) {
			case 'Distanz':
				array.sort(function(a, b){return a.distance-b.distance});
				break;
			case 'Dauer':
				array.sort(function(a, b){return a.duration-b.duration});
				break;
			case 'Abfahrt':
				
				// Sort first by firstStepDistance, then by (global) Distance
				array.sort(function(a, b) {
					var n = a.step.distance.value - b.step.distance.value;
					if (n !== 0) {
						return n;
					}

					return a.distance - b.distance;
				});
				break;
			case 'Bewertung':
				// Sort first by Rating, then by (global) Distance
				array.sort(function(a, b) {
					var n = b.rating - a.rating;
					if (n !== 0) {
						return n;
					}
					
					return a.distance - b.distance;
				});
				break;
		}			
	};
	
	$scope.$on('$ionicView.leave', function() {
		
		if($scope.localInterval) {
			clearInterval($scope.localInterval);	// ends LocalUpdate-Interval	
		}	
		factory1.endTimeout();					// ends GlobalUpdate-Interval
	});		

	var success = function() {
		alert("success");
	};

	var error = function() {
		alert("error");
	};

	$scope.$on('$ionicView.enter', function() {		

		console.log(test);

/*		var push = new PushNotification();

		push.register(success, error, {
			"badge": true,
			"alert": "true"
		});
*/

		//var pushNot = PushNotification();

/*		console.log(PushNotification.prototype.register(success, error, {
			"badge": true,
			"alert": "true"
		}));*/


		//PushNotification.register;

/*		PushNotification.register(success, error, {
			"badge": true,
			"alert": "true"
		});*/

		// Start location Update
		factory1.startPositionUpdate(variables.getMaxSearchDistance(), $scope.globalUpdate);	// always updates the own geolocation / variable is in factory1
		// Updates Values on the View
		$scope.globalTimeout = factory1.startTimeout($scope.globalUpdateInterval, function () {	// Starts timer1 again
			$scope.globalUpdate();		
		});	

	});

	$scope.routeTo = function (path, index) {		// route-Button for each Restaurant
		
		factory1.setOnClickedData($scope, index);
		
		factory1.goTo(path);
	};
	
	$scope.onRefresh = function() {
		
		$scope.globalUpdate();	
		$scope.$broadcast('scroll.refreshComplete');
	};
	
});