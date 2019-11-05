// Steps to complete:

// 1. Initialize Firebase
// 2. Create button for adding new train - then update the html + update the database
// 3. Create a way to train info from the train database.
// 4. Create a way to calculate the minutes until next train. Using difference between first train and current time.//    

// 1. Initialize Firebase
var config = {
    apiKey: "AIzaSyDHpeCBYJ-YNT8KXhs8andJAtSoYrTpLHQ",
    authDomain: "train-scheduler-f29f6.firebaseapp.com",
    databaseURL: "https://train-scheduler-f29f6.firebaseio.com",
    projectId: "train-scheduler-f29f6",
    storageBucket: "train-scheduler-f29f6.appspot.com",
    messagingSenderId: "161973580804",
    appId: "1:161973580804:web:ff2872f215cf34e1b4f151"
  };

  firebase.initializeApp(config);

  var database = firebase.database();

  // 2. Button for adding Trains
$("#add-train-btn").on("click", function(event) {
    event.preventDefault();
  
    // Grab user input
    var trainName = $("#train-name-input").val().trim();
    var trainDestination = $("#destination-input").val().trim();
    var firstTrain = $("#first-train-input").val().trim();
    var trainFrequency = $("#frequency-input").val().trim();
  
    // Creates local "temporary" object for holding train data
    var newTrain = {
      name: trainName,
      destination: trainDestination,
      time: firstTrain,
      frequency: trainFrequency
    };
  
    // Uploads train data to the database
    database.ref().push(newTrain);
  
    alert("Train successfully added");
  
    // Clears all of the text-boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#first-train-input").val("");
    $("#frequency-input").val("");
  });

  // 3. Create Firebase event for adding train info to the database and a row in the html when a user adds an entry
  database.ref().on("child_added", function(childSnapshot) {
    console.log(childSnapshot.val());

    // Store everything into a variable
    var trainName = childSnapshot.val().name;
    var trainDestination = childSnapshot.val().destination;
    var trainTime = moment(childSnapshot.val().time, "hh:mm");
    // var currentTime = moment().format("HH:mm");
    var trainFrequency = childSnapshot.val().frequency;

    // Calculate Train Times
    // Calculate difference in minutes from train time to current time using moment.js
    // add code if else statemtn or while and if current time is < first train then execute the momoent otheriwse subtract 12 hours or soemthign alonf these lines
    var minsDiff = moment().diff(moment(trainTime), "minutes");
    console.log("Difference in minutes from first train is: " + minsDiff);
    // Calculate minutes left until next train
    var remainder = minsDiff % trainFrequency;    
    
    // Create next arrivail variable and add to current time then format to "hh:mm a" using moment.js
    var nextArrival = "";
    var minutesLeft = 0;
    if (minsDiff <= 0) {
      
      // trainTime = moment(childSnapshot.val().time, "HH:mm").add(12, "hours");
      // nextArrival = moment(trainTime, "minutes").format("hh:mm");      
      minutesLeft = +- minsDiff + 1;
      nextArrival = moment().add(minutesLeft, "minutes").format("hh:mm a");
    }
    else { 
      minutesLeft = trainFrequency - remainder;  
      nextArrival = moment().add(minutesLeft, "minutes").format("hh:mm a");
    }  

    // Create the new row
    var newRow = $("<tr>").append(
    $("<td>").text(trainName),
    $("<td>").text(trainDestination),
    $("<td>").text(trainFrequency),
    $("<td>").text(nextArrival),
    $("<td>").text(minutesLeft)
  );

    // Append the new row to the table
    $("#train-table > tbody").append(newRow);
  });

