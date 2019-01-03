var express = require('express');
var bodyParser = require('body-parser');
var cors = require ('cors');
var http = require('http');
var app = express();
var router = express.Router();

var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;

var fs = require('fs');
var ip = 'localhost';

var collectionName = 'RestaurantsAustria';				// Restaurants in Österreich + TestRestaurants in der nähe
var collectionName2 = 'RestaurantsTempAustria';

var url = 'mongodb://'+'localhost'+':27017/exampleDb';

var debug = require('debug')('http');

app.use(cors());
app.use(express.static('public'));
app.use (bodyParser.json());

console.log("hallo");
debug('listening');

var bochumData = require('./bochumData');
var oesterreichData = require('./oesterreichData');

var deg2rad = function(deg) {	
	return deg*(Math.PI/180);
};

var calculateAirDistance = function (lat1, lng1, lat2, lng2) {
	var R = 6371;
	var dLat = deg2rad(lat2-lat1);
	var dLng = deg2rad(lng2-lng1);
	
	var a = 
		Math.sin(dLat/2) * Math.sin(dLat/2)+
		Math.cos(deg2rad(lat1))* Math.cos(deg2rad(lat2))*
		Math.sin(dLng/2)*Math.sin(dLng/2);
		
	var c = 2*Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
	var distance = R*c;
	
	return distance;
};

var getAllData = function() {

	return new Promise(function(resolve, reject) {
			
		MongoClient.connect(url, function(err, db) {
			if (err) throw err;
			
			db.collection(collectionName).find().toArray(function(err, result) {
				
				if(result[0]) {
					resolve(result);
				}
				else {
					resolve();
					//reject();
				}
				
				db.close();
			});
		});
	});
};



app.get('/getAllData/:ownLat/:ownLng/:maxSearchDistance', function(req, res) {					// Finds and gives back every parking space in the database

	// var restaurantPos = {
		// latitude: result[i].position.coordinates[0],
		// longitude: result[i].position.coordinates[1]
	// };
	
	var ownPos = {
		latitude: req.params.ownLat,
		longitude:req.params.ownLng
	};

	getAllData().then(function(result, err) {
		if(err) {
			console.log("err");
			restoreEverything()
				.then(() => restrictListWithMaxDistance(result, ownPos, req.params.maxSearchDistance))
				.then(() => { res.send(result); });		
		}
		else {	
			
			if(result) {							
				if (result.length === 0) {
					console.log("wrong");
					restoreEverything();
					res.send();
				}
				else {	// Correct, everything worked 
					
					restrictListWithMaxDistance(result, ownPos, (req.params.maxSearchDistance/1000))
						.then(()=> { res.send(result); } );
					
				}
			}
			else {
				console.log("wrong2");
				restoreEverything();
				//res.send(0);
			}
			
		}
	});
	
	
    // MongoClient.connect(url, function(err, db) {
        // if (err) throw err;
		
		// console.log("getAllData ...");
		
        // db.collection(collectionName).find().toArray(function(err, result) {
            // if (err) throw err;
			
			// console.log(result[0]);
			
			// if(!result[0]) {
				// restoreEverything();
				
				 // db.collection(collectionName).find().toArray(function(err, result) {
					// if (err) throw err;
				
				// for (var i = result.length-1; i >= 0; i--) {
					// if(distanceIsTooLong(restaurantPos, ownPos, (req.params.maxSearchDistance/1000)) {
						// result.splice(i, 1);
					// }
				// }
				
				// res.send(result);
				 // });
			// }
			// else {
				
				// for (var i = result.length-1; i >= 0; i--) {
					// if(distanceIsTooLong(restaurantPos, ownPos, (req.params.maxSearchDistance/1000)) {
						// result.splice(i, 1);
					// }
				// }
				
				// res.send(result);
			// }
            // db.close();
        // });
    // });
});

var restrictListWithMaxDistance = function(result, ownPosition, maxDistance) {
	
	// restrictByMaxDistance(restaurantPos, ownPos, (req.params.maxSearchDistance/1000))
	return new Promise(function(resolve, reject) {
	
		for (var i = result.length-1; i >= 0; i--) {
			
			var distance = calculateAirDistance(result[i].position.coordinates[0], result[i].position.coordinates[1], ownPosition.latitude, ownPosition.longitude);
			
			if(distance > (maxDistance)) {
				result.splice(i, 1);
			}
		}
		
		resolve(result);
	})
};

app.get('/getRoutes/:lat1/:lng1/:lat2/:lng2', function(req, res) {
	
		http.get('http://localhost:5000/route/v1/driving/'+req.params.lng1+','+req.params.lat1+';'+req.params.lng2+','+req.params.lat2+'?steps=true', function(resp) {		
			
			resp.setEncoding('utf8');
			var result="";
			
			resp.on('data', function (chunk) {
			
				result += chunk;
			});
		   
		   resp.on('end', function() {
		
				result = JSON.parse(result);
						
				var highwayToDestination;

				if(result.routes) {
				
				for ( var i = 0; i < result.routes[0].legs[0].steps.length; i++) {
					
					if(result.routes[0].legs[0].steps[i].maneuver.type === 'off ramp') {
						highwayToDestination = { 
							latitude: result.routes[0].legs[0].steps[i].maneuver.location[1],
							longitude: result.routes[0].legs[0].steps[i].maneuver.location[0]
						};
						i = result.routes[0].legs[0].steps.length;
					}
				}
				
				var resultObject = {
					
					distance: result.routes[0].distance,
					duration: result.routes[0].duration,
					firstStep: result.routes[0].legs[0].steps[0].distance,
					maneuver: {
						type:		result.routes[0].legs[0].steps[0].maneuver.type,
						modifier:	result.routes[0].legs[0].steps[0].maneuver.modifier
					},
					offRampPosition: highwayToDestination
				};				
				res.send(resultObject);
				} else {
					res.end();
				}
		   });
	   });	
});

app.get('/getMapMatching/:previousPositions/:radius/:confidenceThreshold', function(req, res) {	// previousPositions => last 3 or whatever Positions
		
		
		var prePositions = JSON.parse(req.params.previousPositions);
		//console.log(prePositions.length);
		if(prePositions.length > 1)  {
		
		var ref1 = 'http://localhost:5000/match/v1/driving/';
		var ref = '';
		var afterwardsString = '?radiuses=';
		
		for (i = prePositions.length - 1; i >= 0; i--) {
		
			ref += prePositions[i].longitude;
			ref += ',';
			ref += prePositions[i].latitude;
			
			afterwardsString += req.params.radius + '';
			
			if(i != 0) {
				ref += ';';
				afterwardsString += ';';
			}
		}

		//ref += afterwardsString;
		
		var ref3 = ref1 + ref + afterwardsString;

		//console.log(ref);
		
		/*
		6.963610,51.442471
		6.964335,51.442688
		*/
		//ref = "http://localhost:5000/match/v1/driving/6.963610,51.442471;6.964335,51.442688?radiuses=20;20";
		
		//http.get("http://localhost:5000/match/v1/driving/6.963610,51.442471;6.964335,51.442688?radiuses=20;20", function(resp) {	
		http.get(ref3, function(resp) {		
			
			resp.setEncoding('utf8');
			var result="";
			
			resp.on('data', function (chunk) {
				result += chunk;
			});
		   
		   resp.on('end', function() {
				
				result = JSON.parse(result);
				
				if(result.matchings && result.tracepoints[result.tracepoints.length-1]) {	//  && result.tracepoints
				
					var resultObject = {
						confidence: result.matchings[0].confidence,
						latitude: result.tracepoints[result.tracepoints.length-1].location[1],
						longitude: result.tracepoints[result.tracepoints.length-1].location[0]	
					};		
					
					console.log(ref + " / " + resultObject.latitude + " " + resultObject.longitude + " " + resultObject.confidence);
					
					res.send(resultObject);
				} else {
					console.log("nothing found");
					res.end();
				}
		   });
	   });	
	   
	    } else {
			res.end();
		}
});
 
app.get('/createDB/', function(req, res) {

	createDatabase();
	console.log("DB Created");

	res.end();
});

app.get('/restoreAllData/', function(req, res) {

	restoreEverything();
	res.end();
	//res.send(JSON.stringify(ret));

});

var restoreEverything = function() {

	console.log("restore");

	return new Promise(function(resolve, reject) {

		MongoClient.connect(url, function(err, db) {
			if(err) throw err;
				
				for(var i = 0; i < oesterreichData.length; i++) {
						db.collection(collectionName).insertOne(oesterreichData[i], function () {		
						});
				}
				for(var i = 0; i < bochumData.length; i++) {
						db.collection(collectionName).insertOne(bochumData[i], function () {		
						});
				}
				for(var i = 0; i < frankreichData.length; i++) {
						db.collection(collectionName).insertOne(frankreichData[i], function () {		
						});
				}
				resolve();
				db.close();
		});
	});
};

	// MongoClient.connect(url, function(err, db) {
		// if(err) throw err;
			
			// for(var i = 0; i < oesterreichData.length; i++) {
					// db.collection(collectionName).insertOne(oesterreichData[i], function () {		
					// });
			// }
			// for(var i = 0; i < bochumData.length; i++) {
					// db.collection(collectionName).insertOne(bochumData[i], function () {		
					// });
			// }
	// });

// };

createDatabase = function() {
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    console.log("Database created!");

    db.collection(collectionName).createIndex( {position : "2dsphere" });

    db.createCollection(collectionName, function(err, res) {
      if(err) throw err;
      db.close();
    });
  });
};

insertData = function(parkdingSpace) {

	    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
            db.collection(collectionName).insertOne(parkdingSpace, function () {  // EINFÜGEN
                console.log("Data inserted");
            });
    });
};

insertTempData = function(parkdingSpace) {

	    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
            db.collection(collectionName2).insertOne(parkdingSpace, function () {  // EINFÜGEN
                console.log("Data inserted");
            });
    });
};

deleteById = function(thisId) {

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;

		console.log("Delete data");

         db.collection(collectionName).deleteOne({"_id": ObjectId(thisId)});

		 console.log("fourth");

        db.close();
    });
}

sortByDistance = function(latitude, longitude, maxDistance) {			// sorts all parking Spaces in the Database by Distance compared with the current Position of the User

	var orderedList;

    (function (callback) {MongoClient.connect(url, function(err, db) {
        if (err) throw err;

			db.collection(collectionName).find(
			   {
				 position: {
					$nearSphere: {
					   $geometry: {
						  type : "Point",
						  coordinates : [ parseFloat(latitude), parseFloat(longitude)],
					   },
					   $minDistance: 0,
					   $maxDistance: parseFloat(maxDistance)
					  }
				  }
			   }
			).toArray( function (err, result) {

				orderedList = result;
				if(callback) callback();
			});

        db.close();
    });

	}(function () {
		removeCollection(collectionName2);			// CollectionName2 is tempData that is limited
		insertAll(orderedList, collectionName2);
	}));
};

insertAll = function (array, coll) {

	    MongoClient.connect(url, function(err, db) {
        if (err) throw err;

        db.collection(coll).insert(array);

		console.log("Insert into: "+coll);

        db.close();
    });
};

removeCollection = function(name) {					// removes all parking Spaces from the Database
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;

		console.log("RemoveCollection: "+name);
        db.collection(name).remove();

        db.close();
    });
}

app.post('/sortByDistance/:latitude/:longitude/:maxDistance', function(req, res) {	// LÖSCHEN !

	console.log("SortByDistance")
	sortByDistance(req.params.latitude, req.params.longitude, req.params.maxDistance);

	res.end();
	//res.send(JSON.stringify(ret));

});

app.get('/test/', function(req, res) {	// LÖSCHEN !

	var x = 'Hallo1';
	console.log("test1");
	
	removeCollection(collectionName);
	
	res.end(x);
});

app.get('/test2/', function(req, res) {	// LÖSCHEN !

	var x = 'Hallo2';
	console.log("test2");
	
	//removeCollection(collectionName);
	
	res.end(x);
});

app.get('/showAllData', function (req, res) {
	    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
		
        db.collection(collectionName).find().toArray(function(err, result) {
            if (err) throw err;
			
			res.send(result);
			
            db.close();
        });
    });
});

app.get('/getAllData', function(req, res) {					// Finds and gives back every parking space in the database, if there is no data, insert everything in again

	console.log("getAllData");

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
		
        db.collection(collectionName).find().toArray(function(err, result) {
            if (err) throw err;		
			
			//console.log(result);
			if(result) {							
				if (result.length === 0) {
					console.log("wrong");
					restoreEverything()
					.then(function () {
						//res.send(getAllData());
						//http.get('http://localhost:8000/test2/');
						console.log("second");
					});
				}
				else {
					res.send(result);
				}
			}
			else {
				restoreEverything()
				.then(function () {
					//res.send(getAllData());
					console.log("second");
				});
			}

			res.send();
			
            db.close();
        });
    });
});

app.get('/getTempData', function(req, res) {				// Finds and gives back all restaurants that are near the user (maximum Distance is controlled by an input of the user)

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;

        db.collection(collectionName2).find().toArray(function(err, result) {
            if (err) throw err;

            res.send(result);

            db.close();
        });
    });
});

app.get('/getInput/', function(req, res) {		// WEG ???

	res.send(JSON.stringify(obj));
});

app.post('/insert', function(req, res) { 		// !!!

	insertData(req.body);
	res.end();

});

app.post('/insertTemp', function(req, res) { 		// !!!

	insertTempData(req.body);

	res.end();

});

// var p1 = function() {
	
	// return new Promise(function(resolve, reject) {
		// MongoClient.connect(url, function(err, db) {
			// if (err) throw err;

			// db.collection(collectionName).findOne({name: 'Wirtshaus Jagawirt'},(function(err, result) {
				// if (err) throw err;
				
					// //console.log(result);
				// resolve(result);
				// db.close();
			// }));
		// });
	// });
// };

// var p2 = function(a) {
	// console.log(a);
	// return new Promise(function(resolve, reject) {
		
		// MongoClient.connect(url, function(err, db) {
			// if (err) throw err;

			// db.collection(collectionName).find().toArray(function(err, result) {
				// if (err) throw err;
					// //console.log(result);
				// resolve(result);
				// db.close();
			// });
		// });
	// });
// };


app.delete('/deleteById/:id', function (req, res) {

    deleteById(req.params.id);
});

app.delete('/deleteAll', function (req, res) {
    removeCollection(collectionName);		// !!!
	console.log("delete All");
	res.send("Delete");
});

app.listen(8000);
