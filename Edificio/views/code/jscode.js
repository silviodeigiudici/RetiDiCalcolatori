//PLACES FUNCTIONS
function startServices(){
	//using places to find all restaurants
        var service = new google.maps.places.PlacesService(map);
        service.nearbySearch({
          location: buildinglatlng,
          radius: 480,
          type: ['restaurant']    //Type of Search
        }, callback);

        //using places to find all bars
        var service = new google.maps.places.PlacesService(map);
        service.nearbySearch({
          location: buildinglatlng,
          radius: 480,
          type: ['bar']
        }, callbackB);


        //using places to find all Points of Interests
        var service = new google.maps.places.PlacesService(map);
        service.nearbySearch({
          location: buildinglatlng,
          radius: 480,
          type: ['library']  || ['art_gallery'] || ['museum'] || ['church']  //Multi-Search
         }, callbackA);
}


//functions called by Places services functions previously written,to create markers

      function callback(results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          for (var i = 0; i < results.length; i++) {
            createMarker(results[i]);
          }
        }
      }

      function callbackA(results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          for (var i = 0; i < results.length; i++) {
            createMarkerIP(results[i]);
          }
        }
      }
      function callbackB(results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          for (var i = 0; i < results.length; i++) {
            createMarkerBars(results[i]);
          }
        }
      }

      //Create markers for all findings for for Bars
      function createMarker(place) {
        var marker = new google.maps.Marker({
          icon : {  //changing the marker,resizing it
            url: 'https://maps.google.com/mapfiles/kml/shapes/dining.png',
            scaledSize: new google.maps.Size(30, 30), // scaled size
            origin: new google.maps.Point(0,0),
            anchor: new google.maps.Point(0, 0)
        },
          position: place.geometry.location,
          map: map
        });
        infowindow = new google.maps.InfoWindow();
        google.maps.event.addListener(marker, 'click', function() {
          infowindow.setContent(place.name);
          infowindow.open(map, this);
        });
      }


       //Create markers for all findings for for Bars
      function createMarkerBars(place) {
        var marker = new google.maps.Marker({
          icon : {  //changing the marker,resizing it
            url: 'http://maps.google.com/mapfiles/kml/shapes/bars.png',
            scaledSize: new google.maps.Size(20, 20), // scaled size
            origin: new google.maps.Point(0,0),
            anchor: new google.maps.Point(0, 0)
        },
          position: place.geometry.location,
          map: map
        });
        infowindow = new google.maps.InfoWindow();
        google.maps.event.addListener(marker, 'click', function() {
          infowindow.setContent(place.name);
          infowindow.open(map, this);
        });
    }
       //Create markers for all findings for Point of interest
      function createMarkerIP(place) {
        var marker = new google.maps.Marker({
          icon : {  //changing the marker,resizing it
            url: 'http://maps.google.com/mapfiles/kml/shapes/arts.png',
            scaledSize: new google.maps.Size(30, 30), // scaled size
            origin: new google.maps.Point(0,0),
            anchor: new google.maps.Point(0, 0)
        },
          position: place.geometry.location,
          map: map
        });
        infowindow = new google.maps.InfoWindow();
        google.maps.event.addListener(marker, 'click', function() {
          infowindow.setContent(place.name);
          infowindow.open(map, this);
        });
    }


//GEOLOCATION FUNCTIONS
//Here() will locate the user and pin a marker on his current location
function Here(){
         //locating the user
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
          //and placing a marker on his location
          var markerUserLocation = new google.maps.Marker({
          position: pos,
          icon : {  //changing the marker icon from default,resizing it
            url: 'http://maps.google.com/mapfiles/kml/pushpin/blue-pushpin.png',
            scaledSize: new google.maps.Size(50, 50), // scaled size
            origin: new google.maps.Point(0,0),
            anchor: new google.maps.Point(0, 0)
          },
          map: map
        });


        //using reverse geocoding to get an address from latitude and longitude
        var UserLoc = '';
        var lat = parseFloat(position.coords.latitude);
        var lng = parseFloat(position.coords.longitude);
        var latlng = new google.maps.LatLng(lat, lng);
        var geocoder = geocoder = new google.maps.Geocoder();
        geocoder.geocode({ 'latLng': latlng }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                if (results[0]) {
                    UserLoc += results[0].address_components[1].long_name + ", " + results[0].address_components[0].long_name
                    + ", "+   results[0].address_components[2].long_name;}
                }
            });


        //placing an onClick window,to show the user's address on the marker we've placed
        infowindow = new google.maps.InfoWindow();
        google.maps.event.addListener(markerUserLocation, 'click', function() {
          infowindow.setContent('UserLocation : '+UserLoc);
          infowindow.open(map, this);
        });
            map.setCenter(pos);
          }, function() {
            handleLocationError(true, infowindow, map.getCenter());
          });
        } else {
          // Browser doesn't support Geolocation
          handleLocationError(false, infowindow, map.getCenter());
        }

}
//geolocation errors handlers
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
	infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
                              'Error: The Geolocation service failed.' :
                              'Error: Your browser doesn\'t support geolocation.');
        infoWindow.open(map);
}


//Routing functions

        //MyWay() will create a route from the address given by the user,and our building.
        function MyWay(){

        //getting the output from the form and checking if we don't already have a route
        if (flag){
            var addr = document.getElementById("input1").value;
            flag = false;

            //Let's create a track from A(user location) to B(Class building)

            var markerArray = [];

            // Instantiate a directions service.
            var directionsService = new google.maps.DirectionsService;


            // Create a renderer for directions and bind it to the map.
            var directionsDisplay = new google.maps.DirectionsRenderer({map: map});

            // Instantiate an info window to hold step text.
            var stepDisplay = new google.maps.InfoWindow;

            // Display the route between the initial start and end selections.
            calculateAndDisplayRoute(
                directionsDisplay, directionsService, markerArray, stepDisplay, map,addr);
            // Listen to change events from the start and end lists.
            var onChangeHandler = function() {
            calculateAndDisplayRoute(
                directionsDisplay, directionsService, markerArray, stepDisplay, map,addr);
            };
        }
        else{window.alert('Directions request failed,adding too many addresses,please reload the page ');}
      }

//Next three functions are all used by MyWay()
//calculateAndDisplayRoute calls both showSteps and attachInstructionText,to create the route and placing instructions markers on it.
      function calculateAndDisplayRoute(directionsDisplay, directionsService,
          markerArray, stepDisplay, map,address) {

        // Retrieve the start and end locations and create a DirectionsRequest using
        // WALKING directions.
        buildingA = document.getElementById("mainscript").getAttribute("data-build");
        if (buildingA == 'spv'){
            buildingaddress = 'Via Eudossiana, 18, 00184 Roma RM';}
        else{ buildingaddress = 'Via Ariosto, 25, 00185 Roma RM';} //since diag is the default option we are putting its address

        directionsService.route({
          origin : address,
          destination: buildingaddress,  //The destination is hardcoded,since we want to direct the user to the building
          travelMode: 'WALKING'                              //since the app is made for students,WALKING is the most fitting mode.
        }, function(response, status) {
          // Route the directions and pass the response to a function to create
          // markers for each step.
          if (status === 'OK') {
            directionsDisplay.setDirections(response);
            showSteps(response, markerArray, stepDisplay, map);
          } else {
            window.alert('Directions request failed due to ' + status);
          }
        });
      }

      function showSteps(directionResult, markerArray, stepDisplay, map) {
        // For each step, place a marker, and add the text to the marker's infowindow.
        // Also attach the marker to an array so we can keep track of it and remove it
        // when calculating new routes.
        var myRoute = directionResult.routes[0].legs[0];
        for (var i = 0; i < myRoute.steps.length; i++) {
          var marker = markerArray[i] = markerArray[i] || new google.maps.Marker;
          marker.setMap(map);
          marker.setPosition(myRoute.steps[i].start_location);
          attachInstructionText(
              stepDisplay, marker, myRoute.steps[i].instructions, map);
        }
      }

      function attachInstructionText(stepDisplay, marker, text, map) {
        google.maps.event.addListener(marker, 'click', function() {
          // Open an info window when the marker is clicked on, containing the text
          // of the step.
          stepDisplay.setContent(text);
          stepDisplay.open(map, marker);
        });
      }

