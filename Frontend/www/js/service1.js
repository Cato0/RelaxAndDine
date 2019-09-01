angular.module('service1', [])
.service("service1", function($http, factory1,  variables) {

	this.getRoute = function (startLat, startLng, endLat, endLng, callback) {
		
		$http.get('http://'+variables.getIp()+':5000/route/v1/driving/'+startLng+','+startLat+';'+endLng+','+endLat+'?steps=true').then(function (response) {
			
			if (callback) {
				callback(response);
			} else {
				return response;
			}
		});
	};
	
	this.getAllClosestStreets = function (currentLat, currentLng, numberOfResults, callback) {
		
		$http.get('http://'+variables.getIp()+':5000/nearest/v1/driving/'+currentLng+','+currentLat+'?number='+numberOfResults+'&bearings=0,20').then (function (response) {
		
			if(callback) {
				callback(response);
			} else {
				return response;
			}
		});
	};

	this.getMapMatching = function (previousPositions, radius) {	// input is a List of lat/lng Positions

		return new Promise(function (resolve, reject) {

			// gets OSRM-Link for mapMatching. Template: http://87.142.153.142:5000/match/v1/driving/7.2205646,51.4243661;7.2205646,51.4243661?radiuses=20;20
/*			var ref = 'http://'+variables.getIp()+':5000/match/v1/driving/';	

			for(var i = 0; i < previousPositions.length; i++) {
				ref += previousPositions[i].longitude + ',' + previousPositions[i].latitude;
				if(i != previousPositions.length-1) {
					ref += ';';
				}
			}
			ref += '?radiuses=';
			for (var j = 0; j < previousPositions.length; j++) {
				ref += radius;
				if(j != previousPositions.length - 1) {
					ref += ';';
				}
			}

			$http.get(ref).then(function (response) {

				resolve(response);

			},(err) => {
				resolve(err);
				//reject();
			});*/



			$http.get('http://'+variables.getIp()+'/getMapMatching/'+JSON.stringify(previousPositions)+'/'+radius+'/'+0.5).then(function(response) {

				if(response.data) {
					if(response.data.confidence && response.data.confidence > 0.5) {
						resolve(response.data);
					}
					else {
						resolve(factory1.getCurrentPosition());	// if no match has been found -> return normal currentPosition from GPS-Data
					}
				}
				else {
						resolve(factory1.getCurrentPosition());	// if no match has been found -> return normal currentPosition from GPS-Data
				}



				if(!response.data) {
					resolve(factory1.getCurrentPosition());	// if no match has been found -> return normal currentPosition from GPS-Data
				} else {
					resolve(response.data);
				}


			});
		});
	};




	this.getRoutePromise = function (startLat, startLng, endLat, endLng) {
	
			return new Promise(function (resolve, reject) {

/*			$http.get('http://'+variables.getIp()+':5000/route/v1/driving/'+startLng+','+startLat+';'+endLng+','+endLat+'?steps=true').then(function (response, err) {
				
				resolve(response);
			});*/

			$http.get('http://'+variables.getIp()+':8080/getRoutes/'+startLat+'/'+startLng+'/'+endLat+'/'+endLng).then(function (response, err) {
				
				resolve(response);
			});


		});

	};

});