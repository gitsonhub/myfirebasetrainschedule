//military clock on the jumbotron 
function startTime() 
{
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    m = checkTime(m);
    s = checkTime(s);
    document.getElementById('current-time').innerHTML = h + ":" + m + ":" + s;
    var t = setTimeout(startTime, 500);
}

function checkTime(i) { if (i < 10) {i = "0" + i}; return i; } 

// main logic
// Initialize Firebase
var config = {
    apiKey: "AIzaSyA-ZpyaGovBJx-ltC5Mjme6jqi2zu__AEo",
    authDomain: "my-train-schedule-2a5ea.firebaseapp.com",
    databaseURL: "https://my-train-schedule-2a5ea.firebaseio.com",
    projectId: "my-train-schedule-2a5ea",
    storageBucket: "my-train-schedule-2a5ea.appspot.com",
    messagingSenderId: "665587199873"
    };    
    firebase.initializeApp(config);
    var database = firebase.database();

// Submit button on-click event will add train schedule
$("#add-train").on('click', function(event)
{
    event.preventDefault();
    var trainName = $("#train-name-input").val();
    var trainDestination = $("#destination-input").val();
    var trainTime = $("#train-time-input").val();
    var trainFrequency = $("#frequency-input").val();

    database.ref().push(
    {
       name: trainName,
       destination: trainDestination,
       time: trainTime,
       frequency: trainFrequency
    });
    document.getElementById('train-form').reset();
});

//Adding "children" to the current train schedule
database.ref().on('child_added', function(snapshot)
{
    console.log(snapshot.val());

    var nameT = snapshot.val().name;
    var destinationT = snapshot.val().destination;
    var timeT = snapshot.val().time;
    var frequencyT = snapshot.val().frequency;

    console.log("timeT: " + timeT);

    //Calculating time for the trains using moment functions
    var tStart = timeT;
    var tFrequency = frequencyT;

    // First Train Time from user input
    var firstTimeConverted = moment(tStart, "hh:mm").subtract(1, "years");
    console.log("User Train Time Input: " + firstTimeConverted);

    // Current Time
    var currentTime = moment();
    console.log("Current time: " + moment(currentTime).format("hh:mm"));

    // Calculating the difference between time
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("Difference in time: " + diffTime);

    // Time remainder
    var tRemainder = diffTime % tFrequency;
    console.log("tRemainder: " + tRemainder);

    // Minutes until next train
    var tMinutesTillTrain = tFrequency - tRemainder;
    console.log("Minutes till necxt train: " + tMinutesTillTrain);

    // Next train time
    var nextTrain = moment().add(tMinutesTillTrain, "minutes").format("hh:mm");
    console.log("Next train time: " + nextTrain);

    //adding newRow to train table
    var newRow = $("<tr>");

    newRow.append("<td>" + nameT + "</td>");
    newRow.append("<td>" + destinationT + "</td>");
    newRow.append("<td>" + frequencyT + "</td>");
    newRow.append("<td>" + nextTrain + "</td>");
    newRow.append("<td>" + tMinutesTillTrain + "</td>");

    $("#table").append(newRow);
});