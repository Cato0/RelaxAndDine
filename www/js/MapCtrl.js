
var x = 5;

app = angular.module('starter.controllers' , ['ngCordova', 'service1', 'factory1', 'variables'])

app.controller('MapCtrl', function($scope, $state, $cordovaGeolocation,$timeout, factory1,service1,variables, $compile) {
	
	$scope.fac1 = factory1;
	
	var options = {timeout: 10000, enableHighAccuracy: true};  
	$scope.restaurants = 1;

	$scope.comp  = $compile($scope.cont)($scope);
	
	$scope.map;					// Google-Map-Canvas
	$scope.directionsService;
	$scope.directionsDisplay;
	$scope.duration;
	$scope.watch;
	$scope.refresh = true;
	
	switch (variables.getDevice()) {
		
		case 'Android':
			break;
		case 'IOS':
		
			var mapButton = document.getElementById("mapButtonDiv");
			mapButton.style.marginBottom = '120%';	// ??
			
			var content = document.getElementById("mapContent");
			content.style.marginTop = '10px'; content.className += " padding-top";
		
			break;
		default: 
			break;
	};
	
	$scope.drawPathOnClicked = function(index) {					// draws path to the clicked Restaurant
		
		var b1 = document.getElementById("mapButtonDiv");			// set button visible only when the user clicked on a destination
		b1.style.visibility = 'visible';
		
		$scope.onClickedRestaurant = $scope.restaurants[index];		// For the Start-Navigation-Button on the Map
				
		var pos = factory1.getCurrentPosition();
		var currentPos = new google.maps.LatLng( pos.latitude, pos.longitude );
		var destination = new google.maps.LatLng( $scope.restaurants[index].position.coordinates[0], $scope.restaurants[index].position.coordinates[1]);
		
		factory1.route(currentPos, destination, $scope.directionsService, $scope.directionsDisplay);	// $scope.duration	
	}
	
	$scope.updateOwnMarker = function () {
			
			$scope.ownPosition = factory1.getCurrentPosition();
			
			if ($scope.ownPositionMarker) {			
				
				$scope.ownPositionMarker.setMap($scope.map);
				$scope.ownPositionMarker.setPosition(new google.maps.LatLng($scope.ownPosition.latitude, $scope.ownPosition.longitude));
			} else {
				
				$scope.ownPositionMarker = new google.maps.Marker({
					map: $scope.map,
					//animation: google.maps.Animation.DROP,
					icon: {url: 'img/carMarker.png'},
					position: new google.maps.LatLng($scope.ownPosition.latitude, $scope.ownPosition.longitude)
				});

				var newInfoWindow = new google.maps.InfoWindow({
					content: "Sie sind hier!"
				});

				google.maps.event.addListener($scope.ownPositionMarker, 'click', function () {
				newInfoWindow.open($scope.map, this);
				});	
			}	

			if($scope.circle) {			
				$scope.circle.setMap($scope.map);
				$scope.circle.setCenter( {lat: $scope.ownPosition.latitude,lng: $scope.ownPosition.longitude} );
				$scope.circle.setRadius(variables.getMaxSearchDistance());

			} else {
				$scope.circle = new google.maps.Circle({
					strokeColor: '#0000FF',
					strokeOpacity: 1,
					strokeWeight: 1,
					fillColor: '#0000FF',
					fillOpacity: 0,
					map: $scope.map,
					center: {lat: $scope.ownPosition.latitude,lng: $scope.ownPosition.longitude},
					radius: variables.getMaxSearchDistance()
				});
			}	
	};
	
	$scope.$on('$ionicView.enter', function() {							// updates all Data-Points and sets the Point for the Route

		if ($scope.refresh === true) {
		
			$scope.refresh = false;	
			factory1.getTempRestaurantData($scope, $scope.showMap);
			
			// updates 
			$scope.ownMarkerUpdate = setInterval($scope.updateOwnMarker, 1000);
		}
		
		$scope.onClickedRestaurant = factory1.getOnClickedData();
		
		if($scope.onClickedRestaurant === null) {
		
		}
		
	});	
	
	$scope.showMap = function () {										// init Google Map plus Route to the clicked Position

		$showMap = new function() {	

			$cordovaGeolocation.getCurrentPosition(options).then(function(position) {

				var currentPos = factory1.getCurrentPosition();

				var ownPositionLatLng = new google.maps.LatLng(currentPos.latitude, currentPos.longitude);

				if (!$scope.onClickedRestaurant) {

					var latLng = new google.maps.LatLng(currentPos.latitude, currentPos.longitude);

				} else {
					var latLng = new google.maps.LatLng($scope.onClickedRestaurant.position.coordinates[0], $scope.onClickedRestaurant.position.coordinates[1]);
				}

				var mapOptions = {
				  center: latLng,
				  zoom: 10,
				  mapTypeId: google.maps.MapTypeId.ROADMAP
				};

				$scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

				// Service and Display are needed for the GoogleRequest
				$scope.directionsService = new google.maps.DirectionsService;
				$scope.directionsDisplay = new google.maps.DirectionsRenderer();

				$scope.directionsDisplay.setMap($scope.map);
				
				$scope.directionsDisplay.setOptions( { suppressMarkers: true } );	// suppress standard Route Markers (A,B)

				if($scope.onClickedRestaurant) {									              // if User has Clicked on a Destination

					var b1 = document.getElementById("mapButtonDiv");			          // set button visible only when the user clicked on a destination
					b1.style.visibility = 'visible';

				//$scope.drawRoute(new google.maps.LatLng(currentPos.latitude, currentPos.longitude), latLng, $scope.directionsService, $scope.directionsDisplay);
				factory1.route(new google.maps.LatLng(currentPos.latitude, currentPos.longitude), latLng, $scope.directionsService, $scope.directionsDisplay);
				}

				$scope.addRestaurantMarkers();                       // Displays Marker of the Restaurants
				//$scope.addOwnMarker();                            // Displays Marker  on the Users Position
					
			}, function(error){
				console.log("Could not get location");
			});
		};
	};
	
	$scope.drawPath = function (origin,destination) {			  // Draw straight Line between 2 Lat/Lng-Points

		var flightPath = new google.maps.Polyline( {
			path: [origin, destination],
			strokeColor: "#0000FF",
			strokeOpacity: 0.8,
			strokeWeight: 2
		});

		flightPath.setMap($scope.map);
	};
	
	$scope.getDistance = function (latitude, longitude) {		    // gets the Distance from the users Position to one Lat/Lng-Point
	
		var distance;
		var dest = new google.maps.LatLng(latitude, longitude);

		$scope.directionsService.route({
			origin: latLng,
			destination: dest,
			travelMode: google.maps.TravelMode.DRIVING
		}, function(response, status) {

				if (status == google.maps.DirectionsStatus.OK) {
					$scope.directionsDisplay.setDirections(response);

					var point = response.routes[0].legs[0];

					distance = point.distance.text;

				} else {
					window.alert('Directions request failed due to '+ status);
			}
		});
	};
	
	drawPathOnClicked = function(index) {	// calls a function with the controller scope, because ng-click doesnt work in the google info
	
		$scope.drawPathOnClicked(index);
	};
	
	// Changes to the information-page with individual restaurant-index
	goToInfo = function(index) {
		factory1.goTo('app.info', index, $scope);
	};
	
	$scope.i = 0;
	
	$scope.addRestaurantMarkers = function () {							// creates Markers of all saved Restaurants

		google.maps.event.addListenerOnce($scope.map, 'idle', function(){

			var marker = [];
			
			info = new google.maps.InfoWindow();

				for (var i = 0; i < $scope.restaurants.length; i++) {

					var pos = new google.maps.LatLng($scope.restaurants[i].position.coordinates[0], $scope.restaurants[i].position.coordinates[1]);

					marker[i] = new google.maps.Marker({
						map: $scope.map,
						animation: google.maps.Animation.DROP,
						position: pos,
						icon: {url: 'img/GreenMarker_64.png'}
						});

					(function(i) {		// Event Listener übernimmt die Variable nicht, ist immer der letzte Wert aus der schleife
										// -> in Funktionen Kapseln
					var content = "<div class='infoWindow'><b>"+$scope.restaurants[i].name+"</b><br><br>"+
								"<button class='buttonSmallB' onclick='drawPathOnClicked("+i+")'>Route</button>&nbsp;"+
								"<button class='buttonSmallG' onclick='goToInfo("+i+")'>Info</button></div>";							
							
						google.maps.event.addListener(marker[i], 'click', function () {					// onClick -> Open Marker info
							info.setContent(content);
							info.open($scope.map,this);
						});
					}(i));
				}
		});
	};

	$scope.openMap = function () {					                // Opens Map +Navigation to the Destination with a preferred Application

		if($scope.onClickedRestaurant) {
			factory1.openMap(factory1.getCurrentPosition().latitude, factory1.getCurrentPosition().longitude, $scope.onClickedRestaurant.position.coordinates[0], $scope.onClickedRestaurant.position.coordinates[1]);
		}
		//window.open('http://maps.google.com/maps?saddr='+currentPos.latitude+','+currentPos.longitude+'&daddr='+$scope.onClickedRestaurant.position.coordinates[0]+','+$scope.onClickedRestaurant.position.coordinates[1]);
	};
});