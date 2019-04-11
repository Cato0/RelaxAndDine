//app = angular.module('starter.controllers' , ['ngCordova'])

app.controller('ListCtrl', function ($scope, $state, variables, factory1, service1, $ionicModal, $timeout, $rootScope, $ionicScrollDelegate) {

  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

	//$scope.maxNumberOfRestaurants = 20; 		// maximum number of displayed restaurants in the List

	//$scope.maxDistance = 1000*1000;				// shows only restaurants in this Distance in m
	$scope.localUpdateInterval = 1*1000; 		// in milliseconds
	$scope.globalUpdateInterval = 5*60*1000;	//120	// makes complete update + google request	
	
	$scope.localInterval;						// Interval for the localUpdates
	$scope.tempData = [];						// all Restaurants in the Air-Distance-Radius, that in form of restaurant-Objects; restaurants which have too large of an maxDistanceBetweenHighwayAndDestination-Value are thrown; out reloads after global update
	$scope.restaurants = [];					// only all shown Restaurants in the List, limited by maxSearchDistance and maxNumberOfRestaurants
	//$scope.sortBy = 'firstStep';				// distance || duration || firstStep		
	$scope.platform = 'Device';					// Currently used platform (only differences for Android/IOS)
	var done = [];								// Boolean-Array that checks if all restaurants have been updated	
	$scope.firstImage ='/1_640x480.jpg';		// Ending of all First Images that are shown in the List
	$scope.currentPosition;						
	$scope.previousPosition;
	$scope.previousStreetName;
	$scope.distanceBetweenUpdates;
	$scope.previousDistanceBetweenUpdates;
	$scope.previousStreetLocation = {
		latitude: null,
		longitude: null
	};
	//$scope.highwayToDestination = [];

	if(!localStorage.orderBy) {

		localStorage.maxSearchDistance 							= 1000;
		localStorage.maxDistanceBetweenHighwayAndDestination 	= 50;
		localStorage.maxNumberOfRestaurants 					= 20;
		localStorage.orderBy									= 'Erster Schritt';
	}

	if (ionic.Platform.isAndroid() == true) {
		factory1.setDevice('Android');
		//$scope.platform = 'Android';
	} else if (ionic.Platform.isIOS() == true) {
		factory1.setDevice('IOS');
		
		//$scope.platform = 'IOS';
	} else {
		factory1.setDevice('Browser');
	}
	
	// change style for Android of IOS
	switch (factory1.getDevice()) {
		
		case 'Android':
			break;
		case 'IOS':
		
			var content = document.getElementById("content");
			var ionScroll = document.getElementById("ionScroll");
			
			ionScroll.style.height = '85vh';
			content.style.marginTop = '10px'; content.className += " padding-top";
			break;
		default: 
			// alert("default");
			break;
	}
	
    // $scope.tempRestaurant = {				// array from the Input

      // name: "Your Position",
	  // rating: null,
      // distance: null,
	  // duration: null,
	  // step: null,
	  // // firstStepDuration: "next",
	  // maneuver: "next",
	  // img: 'img/RelaxAndDine_images/restaurant_1/1.jpg',
      // position: {
        // type: "Point",
        // coordinates: [0,0]
      // },
	  // description: null,
	  // tel: null,
	  // address: null
    // };
	
	$scope.globalUpdate = function() {	// 1. getDataFromDatabase, 2. start localUpdate - Interval
						
		$scope.tempData = [];
		
		if ( factory1.getCurrentPosition() ) {
		
		//TODO umschreiben sodass es nur die wichtigen Daten herausgibt die im Umkreis sind
		factory1.getDataFromDatabase($scope, $scope.tempData, (function() {				
				
				// clear Interval, so it only runs once
				if ($scope.localInterval) {
					clearInterval($scope.localInterval);
				}			
				
				// throws out all that are farther away than the max Distance / with air radius, before calculating actual routes
				$scope.testForMaximumDistance($scope.tempData);
				
			// if no restaurant is found, restart the search with a bigger radius (+1km), until at least 1 is found
			if($scope.tempData.length === 0 && localStorage.maxSearchDistance < 1000) {
				//$scope.maxDistance += 1000;
				
				variables.setMaxSearchDistance(variables.getMaxSearchDistance()+1000);
				$scope.globalUpdate();
			}
			else {

				// Start localUpdate once before the wait of the interval
				$scope.currentPosition = factory1.getCurrentPosition();						
				
				// 	!!!!!
				//localUpdate();
				mapMatching()	 			 	
		 			.then(getAllRoutePromises)
			 		.then( (res) => modifyList(res));


				//factory1.checkForTimeouts($scope.restaurants);
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
	

	var startLocalInterval = function () {
		
		$scope.localInterval = setInterval(function() {
			
			mapMatching()	 			 	
		 		.then(getAllRoutePromises)
			 	.then( (res) => modifyList(res));
			 	//.then(checkNumbers);
			//factory1.checkForTimeouts($scope.restaurants);
			
		} , $scope.localUpdateInterval);		
	};

	// Sorts the List, and throws out all 
	var modifyList = function (res) {

		return new Promise(function(resolve, reject) {

		 		sortArray($scope.tempData);
		 	 	limitForMaxDistanceBetweenHighwayAndDestination(res);
		 		
		 	 	Promise.all($scope.offRampPromises).then( () => {

			 		$scope.restaurants = $scope.tempData.slice(0,variables.getMaxNumberOfRestaurants());
			 });

			resolve();
		}).then(function() { checkNumbers(); });
	};

	// updates the 3 values on view (Distance, Duration and Step[0] )
	var getAllRoutePromises = function () {

			return new Promise(function(resolve, reject) {

			var routePromises = [];

			for (i = 0; i < $scope.tempData.length; i++) {	
					routePromises.push(service1.getRoutePromise($scope.currentPosition.latitude, $scope.currentPosition.longitude, $scope.tempData[i].position.coordinates[0], $scope.tempData[i].position.coordinates[1]));
					//localUpdate(i, 1);
			}

			// After all promises/routings are done, put in the 3 updated values for distance, duration, firstStep
			Promise.all(routePromises).then((values)=> {

				for (var j = values.length-1; j >= 0; j--) {	

					var route = values[j].data.routes[0];
					
						$scope.tempData[j].distance = (route.distance / 1000).toFixed(1);
						$scope.tempData[j].duration = (route.duration / 60).toFixed(0);
						$scope.tempData[j].step.distance.value = (route.legs[0].steps[0].distance / 1000).toFixed(2);								

						if(route.legs[0].steps[0].maneuver.modifier) {
							$scope.tempData[j].maneuver = route.legs[0].steps[0].maneuver.modifier + " " + route.legs[0].steps[0].maneuver.type;
						} else {
							$scope.tempData[j].maneuver = route.legs[0].steps[0].maneuver.type;
						}	
				}
					resolve(values);
				});				
			});
	};

	// checks if the street Name of the current Route is equal to the street Name of the previous Route, if not maybe the route is wrong (eg. for streets below/above or beneath)
	// gets previousPositin & distanceToLastUpdate
	var mapMatching = function () {
			
		return new Promise(function(resolve, reject) {

			// resp gives 3 different close streets and this function decides which one the user is on right now, based on the name of the previously street
			service1.getAllClosestStreets($scope.currentPosition.latitude, $scope.currentPosition.longitude, 5, function (resp) {
				
				var currentStreetNames = [];						
				var inLoop = false;		
				
				var shortestDistance = 999999;

				// if one location matches the last street, pick that as the current location
				for (var j = 0; j < resp.data.waypoints.length; j++) {				

					console.log("next");
					// Compares last Street Naem
					if($scope.previousStreetName && resp.data.waypoints[j].name === $scope.previousStreetName) {																		
						
						$scope.currentPosition.latitude = resp.data.waypoints[j].location[1];
						$scope.currentPosition.longitude = resp.data.waypoints[j].location[0];
						
						j = resp.data.waypoints.length;	// go out of loop
						inLoop = true;
					}
					// Compares last Position
					if($scope.previousStreetLocation) {

						
						service1.getRoutePromise($scope.currentPosition.latitude, $scope.currentPosition.longitude, $scope.previousStreetLocation.latitude, $scope.previousStreetLocation.longitude).then((res) => {
						
							if(res.data.routes[0].distance < shortestDistance) {
								shortestDistance = res.data.routes[0].distance;

								console.log(shortestDistance);
								
								$scope.currentPosition.latitude = resp.data.waypoints[j].location[1];
								$scope.currentPosition.longitude = resp.data.waypoints[j].location[0];
							}

							
						});

						// nochmal 3 routen berechnungen von LastPosition bis CurrentPosition
							// -> nimm dann die mit der kürzeren Strecke

					}

				}

				// if there is no match with the previous streetName -> new street and find the nearest one
				if (inLoop === false) {
					$scope.previousStreetLocation.latitude = resp.data.waypoints[0].location[1];	// lat
					$scope.previousStreetLocation.longitude = resp.data.waypoints[0].location[0];	// lng

					$scope.previousStreetName = resp.data.waypoints[0].name;
					$scope.currentPosition = factory1.getCurrentPosition();
				}
				
				if ($scope.previousPosition) {
				
					service1.getRoute($scope.currentPosition.latitude, $scope.currentPosition.longitude, $scope.previousPosition.latitude, $scope.previousPosition.longitude, function(resp) {
						
						$scope.distanceBetweenUpdates = resp.data.routes[0].distance;
					});
				}
				
				$scope.previousPosition = $scope.currentPosition;
				$scope.previousDistanceBetweenUpdates = $scope.distanceBetweenUpdates; 

				//resolve($scope.currentPosition);
				resolve();		
			});	
		});		
	};

	// if the distance between off-ramp and destination is too long, delete it from tempData	// for maxDistanceBetweenHighwayAndDestination
	var limitForMaxDistanceBetweenHighwayAndDestination = function (values) {	// Values has to be a the Route Promise for all Restaurants

		$scope.offRampPromises = [];
		//var values = $scope.routeValues;

			for(var i = values.length-1; i >= 0; i--) {
				for (var j = 0; j < values[i].data.routes[0].legs[0].steps.length; j++) {

					if(values[i].data.routes[0].legs[0].steps[j].maneuver.type === 'off ramp') {

						var offRampPosition = [ values[i].data.routes[0].legs[0].steps[j].maneuver.location[1]   ,    values[i].data.routes[0].legs[0].steps[j].maneuver.location[0] ];
						var destination = [$scope.tempData[i].position.coordinates[0]  ,$scope.tempData[i].position.coordinates[1] ];

						$scope.offRampPromises.push(service1.getRoutePromise(offRampPosition[0], offRampPosition[1], destination[0], destination[1]).then((res) => {

							if( res.data.routes[0].distance > variables.getMaxDistanceBetweenHighwayAndDestination() ) {
							
								$scope.tempData.splice(i, 1);
							}
						}));

						j = values[i].data.routes[0].legs[0].steps.length;
					}
				}		
			}	
	}

	// throws out all results that are against the configurated limitations (max distance of the route; distance between the end of the highway and the destination)

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
			case 'Erster Schritt':
				
				// Sort first by firstStepDistance, then by (global) Distance
				array.sort(function(a, b) {
					var n = a.step.distance.value - b.step.distance.value;
					if (n !== 0) {
						return n;
					}

					return a.distance - b.distance;
				});
				break;
			case 'Rating':
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
	
	// Start location Update
	factory1.startPositionUpdate($scope.globalUpdate, variables.getMaxSearchDistance());	

	$scope.$on('$ionicView.enter', function() {	

		// always updates the own geolocation / variable is in factory1
		


		service1.getRoute(70, 7, 55, 10, function (resp) {

			console.log(resp);

		});	
		
		// Updates Values on the View
		$scope.globalTimeout = factory1.startTimeout($scope.globalUpdateInterval, function () {	// Starts timer1 again
			$scope.globalUpdate();		
		});	
	});

	var calculateDistance = function(lat1,lon1,lat2,lon2) {				// gets the Distance in km from 2 points with Latitude and Longitude Values

	  var R = 6371; 												// ~ radius of the earth in km
	  var dLat = deg2rad(lat2-lat1);
	  var dLon = deg2rad(lon2-lon1);
	  var a =
		Math.sin(dLat/2) * Math.sin(dLat/2) +
		Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
		Math.sin(dLon/2) * Math.sin(dLon/2);

	  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
	  var distance = R * c; 										// Distance in km
	  return distance;
	};

	var deg2rad = function(deg) {
	  return deg * (Math.PI/180);
	};
	
	$scope.testForMaximumDistance = function (restaurants) {	// throws out all restaurants that are not close enough, before the routing http-requests
		
		for(var i = restaurants.length-1; i >= 0; i-- ) {
			
			var restaurantPos = { 		
				lat: restaurants[i].position.coordinates[0],
				lng: restaurants[i].position.coordinates[1]
			};
			
			if(calculateDistance(restaurantPos.lat, restaurantPos.lng, factory1.getCurrentPosition().latitude, factory1.getCurrentPosition().longitude) > (variables.getMaxSearchDistance()/1000)) {			
				restaurants.splice(i, 1);
			}
		}	
	};

	$scope.routeTo = function (path, index) {		// route-Button for each Restaurant
		
		factory1.setOnClickedData($scope, index);
		
		$scope.goTo(path);
	};

	$scope.goTo = function (path) {					// Change the ionic state
		
		$state.go(path);
	};
	
	$scope.goToIndex = function (path, index) {					// Change the ionic state
		factory1.setOnClickedData($scope, index);
		$state.go(path);
	};	
	/*
	$scope.onRefresh = function() {
		
		$scope.globalUpdate();	
		$scope.$broadcast('scroll.refreshComplete');
	};
	*/
});