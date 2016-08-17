/////////////// INITIALIZE FIREBASE ///////////////////////

  var config = {
    apiKey: "AIzaSyAQw0H8iTrTwDwvxb1eDYSbD8CC07Yq1Wg",
    authDomain: "train-schedule-b46b9.firebaseapp.com",
    databaseURL: "https://train-schedule-b46b9.firebaseio.com",
    storageBucket: "train-schedule-b46b9.appspot.com",
  };
  firebase.initializeApp(config);

  var database = firebase.database();

  /////////////// AUTHENTICATION ///////////////////////

  $("#sign").on("click", function(){
  	console.log('sign-in works!!');

  	var provider = new firebase.auth.GoogleAuthProvider();//instance of Google provider 

		firebase.auth().signInWithPopup(provider).then(function(result) {
		  // This gives you a Google Access Token. You can use it to access the Google API.
		  var token = result.credential.accessToken;
		  // The signed-in user info.
		  var user = result.user;

		  // ...
		}).catch(function(error) {
		  // Handle Errors here.
		  var errorCode = error.code;
		  var errorMessage = error.message;
		  // The email of the user's account used.
		  var email = error.email;
		  // The firebase.auth.AuthCredential type that was used.
		  var credential = error.credential;
		  
		});
  });




firebase.auth().signOut().then(function() {
  // Sign-out successful.
}, function(error) {
  // An error happened.
});



/////////////// ADD TRAINS TO FIREBASE ON USER INPUT ///////////////////////

$("#addTrain").on("click", function(){//add trains

	// Store user input
	var trainName = $("#trainNameInput").val().trim();
	var destination = $("#destinationInput").val().trim();
	var firstDeparture = $("#firstTimeInput").val().trim();
	var frequency = $("#frequencyInput").val().trim();

	
	var train = { // Stores object with train data
		trainName:  trainName,
		destination: destination,
		firstDeparture: firstDeparture,
		frequency: frequency
	}

	
	database.ref().push(train); // Add train to firebase

	// Logs everything to console
	console.log(train.trainName);
	console.log(train.destination);
	console.log(train.firstDeparture);
	console.log(train.frequency)


	// Reset input text-boxes to empty
	$("#trainNameInput").val("");
	$("#destinationInput").val("");
	$("#firstTimeInput").val("");
	$("#frequencyInput").val("");

	// Prevents moving to new page
	return false;
});

/////// WHEN TRAIN IS ADDED DO CALCULATIONS AND DISPLAY ////////

database.ref().on("child_added", function(childSnapshot){

	// console.log(childSnapshot.val());

	// Store everything into a variable.
	var newTrainName = childSnapshot.val().trainName;
	var newTrainDestination = childSnapshot.val().destination;
	var newTrainFirstDeparture = childSnapshot.val().firstDeparture;
	var newTrainFrequency = childSnapshot.val().frequency;

	// print to console
	console.log('Train name: '+ newTrainName);
	console.log('Destination: ' + newTrainDestination);
	console.log('First Train was: ' + newTrainFirstDeparture);
	console.log('Train Frequency: ' + newTrainFrequency);

	//Get current time
	var now = moment().format("HH:mm");
	console.log('The time is: ' + now );

	//Calculate next time arrival
	// newTrainFirstDeparture

		// var tFrequency = 3;
		var firstTime = newTrainFirstDeparture; 
		var nextArrival = "TBD";
		var minutesAway = "TBD"
		
		var firstTrainEver = moment(newTrainFirstDeparture, "HH:mm").subtract(1, "years");
		console.log("Coverted 1st time " + firstTrainEver);

		// // Current Time
		// var currentTime = moment();
		// console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

		// Difference between the times
		var diffTime = moment().diff(moment(firstTrainEver), "days");
		console.log("DIFFERENCE IN TIME: " + diffTime);

		// Time apart (remainder)
		var tRemainder = diffTime % newTrainFrequency;
		console.log("Time apart " + tRemainder);

		// Minute Until Train
		var tMinutesTillTrain = newTrainFrequency - tRemainder;
		console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain + " minutes");

		// Next Train
		var nextArrival = moment().add(tMinutesTillTrain, "minutes")
		console.log("ARRIVAL TIME: " + moment(nextArrival).format("hh:mm") + ' .In ' + tMinutesTillTrain + " minutes");



	// Add each train's data into the table
	$("#trainTable > tbody").append("<tr><td>" + newTrainName + "</td><td>" + newTrainDestination + "</td><td>" + newTrainFrequency  + "</td><td>" + nextArrival.format("hh:mm")  + "</td><td>" + tMinutesTillTrain + "</td><td>" + "<button data-name='" + newTrainName + "'class='btn btn-default btn-block btn-xs btn-danger'>Delete Schedule</button>" + "</td></tr>");
});


$(document.body).on('click', '.btn-danger', function(){

	$( "tr" ).click(function() {
	  var index = $( "tr" ).index( this );
	  var tableContents = $("#trainTable > tbody").children()
	  tableContents.eq(index-1).remove();
	  
	});
	
});



/////////////// PRESENCE SYSTEM ///////////////////////

var connectionsRef = database.ref("/connections");//stablish reference

var connectedRef = database.ref(".info/connected");

connectedRef.on("value", function(snap) {//on value change

	if( snap.val() ) {//if value changes
		var connection = connectionsRef.push(true);//we add user the connection list
		connection.onDisconnect().remove();//or we remove the user from the connection list when they disconnect.
	};

});

connectionsRef.on("value", function(snap) {//displayed on browser
	$("#schedulers").html('Number of user working on Master Schedule: ' + snap.numChildren());

});



