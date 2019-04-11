app.controller('infoCtrl', function ($scope, $http, $state, factory1,variables, $ionicModal, $timeout, $rootScope, $cordovaGeolocation) {



	$scope.address = 'Restaurant Description';
	$scope.one = '1';
	$scope.starsCreated = false;
	$scope.fac1 = factory1;
	
	$scope.ownPosition = {
		latitude: null,
		longitude: null
	};
	
    $scope.data = {				// temporary array from the Input

      name: "Your Position",
	  rating: null,
      distance: null,
	  duration: null,
	  step: null,
	  // firstStepDuration: "next",
	  maneuver: "next",
	  img: 'img/RelaxAndDine_images/restaurant_1/1.jpg',
      position: {
        type: "Point",
        coordinates: [0,0]
      }
    };	
	
	$scope.src = {
		first:	'img/RelaxAndDine_images/restaurant_'+$scope.one+'/1_640x480.jpg',
		second:	'img/RelaxAndDine_images/restaurant_1/2_640x480.jpg',
		third: 	'img/RelaxAndDine_images/restaurant_1/3_640x480.jpg'
	};
	
	switch (variables.getDevice()) {
		
		case 'Android':
			break;
		case 'IOS':
			
			var scrollInfo = document.getElementById("ionScrollInfo");
			//scrollInfo.style.height = '30vh';
			
			var content = document.getElementById("infoContent");
			content.style.marginTop = '10px'; content.className += " padding-top";
			
			break;
		default: 
			break;
	};
	
	$scope.setOnClickedData = function () {	
		
		$scope.data = factory1.getOnClickedData();
		$scope.id = factory1.getOnClickedId();
		
		if($scope.data) {
		
			$scope.latitude = $scope.data.position.coordinates[0];
			$scope.longitude = $scope.data.position.coordinates[1];
			
			if ($scope.starsCreated == false) {
					factory1.buildStars("starDiv", 5, $scope.data.rating);
					$scope.starsCreated = true;
			}
					
			displayLocation($scope.latitude,$scope.longitude , function () {				
				$scope.$apply();
			});
		
		}
	};
	
	$scope.options = {
		
		start: 1,
		loop: false,
		effect: 'wave',
		loop: false,
		speed: 700,
		autoplay: false,
		
	}	
		
	$scope.$on("$ionicSlides.sliderInitialized", function(event, data) {
		$scope.slider = data.slider;
	});
	
	$scope.$on("$ionicSlides.slideChangeStart", function(event, data) {
		
	});
	
	$scope.$on("$ionicSlides.slideChangeEnd", function(event, data) {
		$scope.activeindex = data.slider.activeIndex;
		$scope.previousIndex = data.slider.previousIndex;
	});
	
	$scope.goTo = function (path) {					// Change the ionic state
		
		$state.go(path);
	};
	
	$scope.$on('$ionicView.enter', function () {

		$scope.setOnClickedData();
		
		if($scope.data) {	
		
			if($scope.id || $scope.id == 0) {
				
				var img = $scope.data.img;
					
				document.getElementById("slideImg1").src = img + "/1_640x480.jpg";		//'img/RelaxAndDine_images/restaurant_'+$scope.data.img.charAt(35)+'/1_640x480.jpg';
				document.getElementById("slideImg2").src = img + "/2_640x480.jpg";	//img.slice(0,37) + '2' + img.slice(38); //'img/RelaxAndDine_images/restaurant_'+$scope.data.img.charAt(35)+'/2_640x480.jpg';
				document.getElementById("slideImg3").src = img + "/3_640x480.jpg";	//img.slice(0,37) + '3' + img.slice(38); 'img/RelaxAndDine_images/restaurant_'+$scope.data.img.charAt(35)+'/3_640x480.jpg';		
			}	
		}
	
		$scope.ownPosition = factory1.getCurrentPosition();
	});

	$scope.openMap = function () {
		
		factory1.openMap($scope.ownPosition.latitude, $scope.ownPosition.longitude, $scope.data.position.coordinates[0], $scope.data.position.coordinates[1]);		
	}
	
	function displayLocation(latitude,longitude, callback){			// Puts string in $scope.addresse, asynch
        var request = new XMLHttpRequest();

        var method = 'GET';
        var url = 'http://maps.googleapis.com/maps/api/geocode/json?latlng='+latitude+','+longitude+'&sensor=true';
        var async = true;

		var address;		
		
        request.open(method, url, async);
        request.onreadystatechange = function(){
          if(request.readyState == 4 && request.status == 200){
            var data = JSON.parse(request.responseText);
            address = data.results[0];
			$scope.address = address.formatted_address;
			
			if(callback) callback();
          }
        };
        request.send();
		
    };
	
});








      