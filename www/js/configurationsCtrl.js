app.controller('configurationsCtrl', function ($scope, variables, factory1) {
	
	// in km						// View / Anzeige
	//$scope.maxSearchDistance;
	//$scope.maxDistanceBetweenHighwayAndDestination;
	//$scope.maxNumberOfRestaurants;
	//zahlen in maxSearchDistance	// ng-model

	$scope.attributes = {
		maxSearchDistance: variables.getMaxSearchDistance(),
		maxDistanceBetweenHighwayAndDestination: variables.getMaxDistanceBetweenHighwayAndDestination(),
		maxNumberOfRestaurants: variables.getMaxNumberOfRestaurants(),
	};
	
	switch (factory1.getDevice()) {
		
		case 'Android':
			break;
		case 'IOS':
		
			var content = document.getElementById("configContent");
			content.style.marginTop = '10px'; content.className += " padding-top";

			break;
		default: 
			break;
	}

	$scope.$on('$ionicView.enter', function() {

		$scope.maxSearchDistance 						= ($scope.attributes.maxSearchDistance/1000).toFixed(0);
		$scope.maxDistanceBetweenHighwayAndDestination 	= ($scope.attributes.maxDistanceBetweenHighwayAndDestination/1000).toFixed(0);
		$scope.maxNumberOfRestaurants 					= $scope.attributes.maxNumberOfRestaurants;

		var orderBy = document.getElementById("select");
		orderBy.value = localStorage.orderBy;
	});

	$scope.setMaxSearchDistance = function() {
		
		// converts the meter value from the ng Input, into the km Value that is being displayed in the View
		$scope.attributes.maxSearchDistance = parseInt($scope.attributes.maxSearchDistance/1000)*1000;
		$scope.maxSearchDistance = parseInt($scope.attributes.maxSearchDistance/1000);

		variables.setMaxSearchDistance($scope.attributes.maxSearchDistance);
	};
	
	$scope.setMaxDistanceBetweenHighwayAndDestination = function() {
		
		$scope.attributes.maxDistanceBetweenHighwayAndDestination = parseInt($scope.attributes.maxDistanceBetweenHighwayAndDestination/1000)*1000;
		$scope.maxDistanceBetweenHighwayAndDestination = parseInt($scope.attributes.maxDistanceBetweenHighwayAndDestination/1000);

		variables.setMaxDistanceBetweenHighwayAndDestination($scope.attributes.maxDistanceBetweenHighwayAndDestination);
	};

	$scope.setMaxNumberOfRestaurants = function() {

		variables.setMaxNumberOfRestaurants($scope.attributes.maxNumberOfRestaurants);
	};

	setOrder = function() {

		var orderBy = document.getElementById("select");		
		variables.setOrderBy(orderBy.value);
	}
	
});