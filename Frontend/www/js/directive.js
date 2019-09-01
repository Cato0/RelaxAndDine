app.directive('tableRow', function(factory1, variables) {                    			// Row with Restaurants + Info + Route
	
	return {
		templateUrl: 'templates/Directive.html',
		restrict: 'EA',
		scope:true,

		scope: {
			control: '=',
			myindex: '=',				
			allRestaurants: '=all',		// all restaurants in the view
			rest: '=m',					// restaurant-object that is being clicked on
			img: '=imagesrc',			// -> /1_640x480.jpg rest of the src that is being shown in the list
			
			onDelete: '&',
			onRoute: '&',				
			onGo: '&',
		},
		
		link: function (scope) {	

			scope.controlObject = scope.control || {};		// object with functions, that can be accessed from the list-controller

			scope.controlObject.changeDirectionImages = function (i, modifier, type) {

				var images = document.getElementsByClassName("directionImage");

					switch(modifier) {
						case 'straight' 	: images[i].src = '../www/img/pfeil_straight.png'; break;
						case 'depart'  		: images[i].src = '../www/img/pfeil_straight.png'; break;
						case 'left'			: images[i].src = '../www/img/pfeil_left.png';	 break;
						case 'slight left'	: images[i].src = '../www/img/pfeil_left.png';	 break;
						case 'sharp left'	: images[i].src = '../www/img/pfeil_left.png';	 break;
						case 'right'		: images[i].src = '../www/img/pfeil_right.png';	 break;
						case 'slight right'	: images[i].src = '../www/img/pfeil_right.png';	 break;
						case 'sharp right'	: images[i].src = '../www/img/pfeil_right.png';	 break;
						default				: images[i].src = '../www/img/pfeil_right.png';	
					};
			};

			scope.controlObject.buildStars = function (i, rating) {
				factory1.deleteStars("starDiv"+i);				// remove old stars
				factory1.buildStars("starDiv"+i, 5, rating);	// build new stars, for when the position changes
			};

			scope.route = function () {		// navigates to the map state and makes a google request to calculate the Route
				scope.onRoute();
			};

			scope.delete = function() {
				scope.onDelete();
			};		
			
			scope.go = function() {		// directs to info state
				
				scope.onGo();
			};
		}
	};
});