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
	var firstDeparture = moment($("#firstTimeInput").val().trim(), "HH:mm").format("X");
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

	console.log(childSnapshot.val());

	// Store everything into a variable.
	var newTrainName = childSnapshot.val().trainName;
	var newTrainDestination = childSnapshot.val().destination;
	var newTrainFirstDeparture = childSnapshot.val().firstDeparture;
	var newTrainFrequency = childSnapshot.val().frequency;

	// print to console
	console.log(newTrainName);
	console.log(newTrainDestination);
	console.log(newTrainFirstDeparture);
	console.log(newTrainFrequency);

	// Prettify the employee start
	// var empStartPretty = moment.unix(empStart).format("MM/DD/YY");
	// // Calculate the months worked using hardconre math
	// // To calculate the months worked
	// var empMonths = moment().diff(moment.unix(empStart, 'X'), "months");
	// console.log(empMonths);

	// // Calculate the total billed rate
	// var empBilled = empMonths * empRate;
	// console.log(empBilled);

	// Add each train's data into the table
	$("#trainTable > tbody").append("<tr><td>" + newTrainName + "</td><td>" + newTrainDestination + "</td><td>" + newTrainFirstDeparture + "</td><td>" + newTrainFrequency + "</td><td>");

});
