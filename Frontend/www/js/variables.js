angular.module('variables', [])
.factory('variables', function() {

	//var nodeServerIp = 'nisys.dlinkdns.com';
	var nodeServerIp = '87.142.153.142';
	
	var dataClickedOn;
	var onClickedId;	
	var x = 0;												// temp Variable for Routing
	var device = 'Unknown';									// Currently used platform (only differences for Android/IOS)
	
	// Rausnehmen?? weil sie im local storage drin sind
	// var maxDistanceBetweenHighwayAndDestination;		// Distance from the exit of the highway to the restaurant
	// var maxSearchDistance;							// Radius Air-Distance in which the first search for the Restaurants happens
	// var maxNumberOfRestaurants;						//maximum number of displayed restaurants in the List
	// var orderBy;

	return {

			setOrderBy: function (value) {
				// orderBy = value;
				localStorage.orderBy = value;
			},

			getOrderBy: function() {
				//return maxNumberOfRestaurants;
				return localStorage.orderBy;
			},
			setMaxNumberOfRestaurants: function (value) {
				//maxNumberOfRestaurants = value;
				localStorage.maxNumberOfRestaurants = value;
			},

			getMaxNumberOfRestaurants: function() {
				//return maxNumberOfRestaurants;
				return localStorage.maxNumberOfRestaurants;
			},

			setMaxDistanceBetweenHighwayAndDestination: function (value) {
				//maxDistanceBetweenHighwayAndDestination = value/1000;
				localStorage.maxDistanceBetweenHighwayAndDestination = value/1000;	
			},
			
			getMaxDistanceBetweenHighwayAndDestination: function () {
				return localStorage.maxDistanceBetweenHighwayAndDestination*1000;
				//return maxDistanceBetweenHighwayAndDestination*1000;	
			},

			setMaxSearchDistance: function (value) {

					localStorage.maxSearchDistance = value/1000;
			},
			
			getMaxSearchDistance: function () {
				
				return localStorage.maxSearchDistance*1000;	
			},
			
		
			setDevice: function (string) {
				
				device = string;
			},
			
			getDevice: function () {
				
				return device;
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

			getIp: function () {

				return nodeServerIp;
			},
			
			getX: function () {
				
				return x;
			}
		}
});