  /////////////// INITIALIZE FIREBASE///////////////////////

  var config = {
    apiKey: "AIzaSyAQw0H8iTrTwDwvxb1eDYSbD8CC07Yq1Wg",
    authDomain: "train-schedule-b46b9.firebaseapp.com",
    databaseURL: "https://train-schedule-b46b9.firebaseio.com",
    storageBucket: "train-schedule-b46b9.appspot.com",
  };
  firebase.initializeApp(config);

  var database = firebase.database();



  /////////////// ADD TRAINS TO FIREBASE ON USER INPUT///////////////////////

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
	$("#employeeNameInput").val("");
	$("#roleInput").val("");
	$("#startInput").val("");
	$("#rateInput").val("");

	// Prevents moving to new page
	return false;
});

  ///////////////WHEN TRAIN IS ADDED DO CALCULATIONS AND DISPLAY ///////////////////////

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
	$("#trainTable > tbody").append("<tr><td>" + newTrainName + "</td><td>" + newTrainDestination + "</td><td>" + newTrainFrequency  + "</td><td>" + nextArrival.format("hh:mm")  + "</td><td>" + tMinutesTillTrain + "</td><td>");

});
