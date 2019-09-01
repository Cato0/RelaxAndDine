angular.module('factory1', [])
.factory('factory1', function($http, $cordovaGeolocation, $rootScope, $state, $window, variables) {

	//var allRestaurantData;		
	var dataClickedOn;
	var onClickedId;	
	var timer;
	var localUpdateTimer;
	var timeouts = [];
	var x = 0;					// temp Variable for Routing
	var watch;
	var callback_function;
	var device = 'Unknown';		// Currently used platform (only differences for Android/IOS)
	var currentPosition = {
			latitude: null,
			longitude: null
	};
	var distanceBetweenHighwayAndDestination;
	var maxSearchDistance;

	// deletes some restaurants, that the driver already passed
	checkForTimeouts = function(array) {					// $scope.restaurants-Array as parameter		
		
		for(j = array.length-1; j >= 0; j--) {				// if a name is in the timeout, dont display it, only after a certain amount of time
			for (k = timeouts.length-1; k >= 0; k--) {
				
				if(array[j]._id == timeouts[k].id) {
					
					if(timeouts[k].counter === 0) {
						console.log("SPLICE: "+k);
						timeouts.splice(k, 1);
					} else {	
					timeouts[k].counter--;
					array.splice(j, 1);
					}
				}
			}
		}
	};
	
	return {
			setDistanceBetweenHighwayAndDestination: function (value) {
				distanceBetweenHighwayAndDestination = value;	
			},
			
			getDistanceBetweenHighwayAndDestination: function () {
				return distanceBetweenHighwayAndDestination;	
			},

			setMaxSearchDistance: function (value) {
				maxSearchDistance = value;	
			},
			
			getMaxSearchDistance: function () {
				return maxSearchDistance;	
			},
			
			setDevice: function (string) {
				device = string;
			},
			
			getDevice: function () {	
				return device;
			},
		
			goTo: function (path, index, scope) {					// Change the ionic state
				if(scope) {	
					this.setOnClickedData(scope, index);
				}
				$state.go(path);
			},			
		
			getCurrentPosition: function() {
				return currentPosition;
			},
			
			getPositionMarker: function (lat, lng) {
				
				var positionMarker = new google.maps.Marker({
					map: $scope.map,
					animation: google.maps.Animation.DROP,
					position: new google.maps.LatLng(lat, lng)
				});
				
				return positionMarker;
			},
			
			startPositionUpdate: function(maxDistance,callback) {
				var callback_function = callback;				
				var temp = 0;
				
				watch = navigator.geolocation.watchPosition(function (position) {
						
					currentPosition.latitude = position.coords.latitude;
					currentPosition.longitude = position.coords.longitude;
						
					//var currentState = $state.current.name;
					
					// on Refresh start update after the position has been found
					if(temp == 0) {
						temp++;
						if(callback) {
							callback(maxDistance);
						}
					}
				}, function() { console.log("coudln't get geolocation"); } );
			},
			
			endPositionUpdate: function () {
				navigator.geolocation.clearWatch(watch);
			},
		
			startTimeout: function(milliseconds, func) {
				timer = setInterval(func, milliseconds);
			},
			
			endTimeout: function() {					
				clearInterval(timer);	
			},
			
			openMap: function (ownLat, ownLon, destLat, destLon) {
				
				window.open('http://maps.google.com/maps?saddr='+ownLat+','+ownLon+'&daddr='+destLat+','+destLon);
				
			},
	
			buildStars: function (divName, maxNumberOfStars, numberOfFilledStars) {
				
				var starDiv = document.getElementById(divName);

				for (i=0; i<maxNumberOfStars; i++) {	// Creates 5 Stars filled or not
					
					if(numberOfFilledStars>i) {
						var textNode = document.createElement('TEXT');
						textNode.classList.add("icon");
						textNode.classList.add("ion-ios-star");
						starDiv.appendChild(textNode);
					} else {
						var textNode = document.createElement('TEXT');
						textNode.classList.add("icon");
						textNode.classList.add("ion-ios-star-outline");
						starDiv.appendChild(textNode);
					}
				}
			},		

			deleteStars: function (divName) {
				var starDiv = document.getElementById(divName);

				while(starDiv.firstChild) {
					starDiv.removeChild(starDiv.firstChild);
				}
			},	
	
			route: function (pointA, pointB, directionsService, directionsDisplay, obj, currentArraySize, callback) {				// Draw a Route between 2 Lat/Lng-Points
					
				directionsService.route({
					origin: pointA,
					destination: pointB,
					travelMode: google.maps.TravelMode.DRIVING
				}, function(response, status) {
					
					
					var setData = function () {
					
						// change all above into a function
						directionsDisplay.setDirections(response);
						
						var point = response.routes[0].legs[0];							
						
						if(obj) {
							obj.distance = (point.distance.value / 1000).toFixed(2);		// in m	// km ?!
							obj.duration = (point.duration.value /60).toFixed(0);	// in min
							
							obj.step = point.steps;					

							x++;
										
							if(callback && x == currentArraySize) {
								callback();
								x = 0;
							}					
						}					
					};
					
					// put all steps into the array and make changes in listCtrl				
					if(status != google.maps.DirectionsStatus.OK) {
					
						window.alert('Directions request failed due to ' + status);
					
						setTimeout(function() {							
							setData();							
						}, 2000);
					
					}					
					else if (status == google.maps.DirectionsStatus.OK) {			
							setData();						
					} else {
						window.alert('Directions request failed due to ' + status);
					}			
				});				
			},
		
			getDistance: function(lat1, lon1, lat2, lon2, obj, currentArraySize, callback) {
				
					directionsService = new google.maps.DirectionsService;
					directionsDisplay = new google.maps.DirectionsRenderer();
					
					var latLng1 = new google.maps.LatLng(lat1, lon1);
					var latLng2 = new google.maps.LatLng(lat2, lon2);				
				if(callback) {
					this.route(latLng1, latLng2, directionsService, directionsDisplay, obj, currentArraySize, callback);							
				} else {				
					this.route(latLng1, latLng2, directionsService, directionsDisplay, currentArraySize, obj);
				}			
			},

			setOnClickedData: function(scope, index) {

				dataClickedOn = scope.restaurants[index];

				onClickedId = index;
			},

			getOnClickedData: function(callback) {
				
				return dataClickedOn;
			},
			
			getOnClickedId: function(callback) {
				
				return onClickedId;
			},
			
			getData: function(callback) {
				
				if(callback) callback(dataClickedOn.latitude, dataClickedOn.longitude);
			},

			getEmptyrestaurantData: function (scope, callback) {
				
				$http.get('http://'+variables.getIp()+'/getAllData/').then(function successCallback(response) {

					alert(response.data[0].img);
				
					if (scope.restaurants){
						
						for (i = 0; i<response.data.length; i++) {
							
							response.data[i].img = null;
						}
						
						alert(response.data[0].img);
						
						scope.restaurants = response.data;
					}
					


					if(callback) {
						callback();
					}
					
				}), (function errorCallback(response) {
					console.log('getAllData geht nicht');
				});
			},
			
			addRestaurantTimeout: function (restId, counterVariable) {
				
				var newTimeout = {
					id: restId,
					counter: counterVariable
				};
				timeouts.push(newTimeout);
			},
			
			getDataFromDatabase: function (arr,searchDistance, callback) {					// gives out every Restaurant in the Database / plus optional callback			

				$http.get('http://'+variables.getIp()+'/getAllData/'+currentPosition.latitude+'/'+currentPosition.longitude+'/'+searchDistance).then(function successCallback(response) {
						
						for (i = 0; i < response.data.length; i++) {	
							arr.push(response.data[i]);						
						}
					
					//checkForTimeouts(array);	// deletes some restaurants, that the driver already passed
					if(callback) {
						callback();
					}
					
				}), (function errorCallback(response) {
					console.log('getAllData geht nicht');
				});
			},
			
			getTempRestaurantData: function (scope, callback) {					// gives out every Restaurant in the Database + optional callback
					
				$http.get('http://'+variables.getIp()+'/getTempData/').then(function successCallback(response) {

					if (scope.restaurants){
						scope.restaurants = response.data;
					}
					
					if(callback) callback();

				}), (function errorCallback(response) {
					console.log('getAllData funktioniert nicht');
				});

			},
			
			getX: function () {
				
				return x;
			},

			calculateAirDistance: function(lat1,lon1,lat2,lon2) {				// gets the Distance in km from 2 points with Latitude and Longitude Values

			  var R = 6371; 												// ~ radius of the earth in km
			  var dLat = this.deg2rad(lat2-lat1);
			  var dLon = this.deg2rad(lon2-lon1);
			  var a =
				Math.sin(dLat/2) * Math.sin(dLat/2) +
				Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
				Math.sin(dLon/2) * Math.sin(dLon/2);

			  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
			  var distance = R * c; 										// Distance in km
			  return distance;
			},

			deg2rad: function(deg) {
			  return deg * (Math.PI/180);
			}

		}
});




