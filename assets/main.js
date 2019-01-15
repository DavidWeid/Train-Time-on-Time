// Initialize Firebase
var config = {
  apiKey: "AIzaSyCVOLgFeEPIUPyOjuqE8fYbcK4ZCEXKCEk",
  authDomain: "trains-are-coming.firebaseapp.com",
  databaseURL: "https://trains-are-coming.firebaseio.com",
  projectId: "trains-are-coming",
  storageBucket: "trains-are-coming.appspot.com",
  messagingSenderId: "683265753034"
};

firebase.initializeApp(config);

// FirebaseUI config.
var uiConfig = {
  signInSuccessUrl: "trainsMainPage.html",
  signInOptions: [

    // Leave the lines as is for the providers you want to offer your users.
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.GithubAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID
  ],

  // tosUrl and privacyPolicyUrl accept either url string or a callbacK function.
  // Terms of service url/callback.
  tosUrl: "<your-tos-url>",

  // Privacy policy url/callback.
  privacyPolicyUrl: function() {
    window.location.assign("<your-privacy-policy-url>");
  }
};

// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());

// The start method will wait until the DOM is loaded.
ui.start("#firebaseui-auth-container", uiConfig);

var database = firebase.database().ref("/trainInfo");

// When user clicks "Submit"
$("#submit-btn").on("click", function(event) {
  event.preventDefault();

  // Grab user inputs and store
  var trainName = $("#name-input")
    .val()
    .trim();
  var destination = $("#destination-input")
    .val()
    .trim();
  var firstTime = $("#firstTime-input")
    .val()
    .trim();
  var frequency = $("#frequency-input")
    .val()
    .trim();

  // If user misses any of the inputs nothing happens (no modal, no submit)
  if (
    trainName === "" ||
    destination === "" ||
    firstTime === "" ||
    frequency === ""
  ) {
    console.log("All inputs required");
    $("#submit-btn").attr("data-toggle", "false");

    // When all inputs are filled
  } else {
    // Trigger success modal
    $("#submit-btn").attr("data-toggle", "modal");

    // Set and push user inputs into Firebase
    var addDataBase = database.push();

    addDataBase.set({
      trainName: trainName,
      destination: destination,
      firstTime: firstTime,
      frequency: frequency,
      dateAdded: firebase.database.ServerValue.TIMESTAMP
    });

    // Clear form
    $("#name-input").val("");
    $("#destination-input").val("");
    $("#firstTime-input").val("");
    $("#frequency-input").val("");

    // Log train's first time and its frequency
    console.log(firstTime);
    console.log(frequency);
  }
});

// When a new entry is pushed
database.on("child_added", function(trainshot) {
  // log and set trainshot.val()
  console.log(trainshot.val());
  var tv = trainshot.val();

  // Create a row, an extra column, and two divs with the train name and the destination
  var row = $("<div>").attr("class", "row text-center my-2 text-blue");
  var extraDivFirst = $("<div>").attr("class", "col-1");
  var trainName = $("<div>")
    .attr("class", "col-2")
    .text(tv.trainName);
  var destination = $("<div>")
    .attr("class", "col-2")
    .text(tv.destination);

  // Make user's first train time into HH:mm format and make it a moment
  var firstTrainFormat = moment(tv.firstTime, "HH:mm");

  // Grab the hour of the first train
  var firstHour = moment(firstTrainFormat).format("HH");
  console.log(firstHour);

  // Grab the minute of the first train
  var firstMinute = moment(firstTrainFormat).format("m");
  console.log(firstMinute);

  // Set the first train time to TODAY at the designated hour and minute
  var todayFirstTrain = moment().set({ hour: firstHour, minute: firstMinute });
  console.log("Today's first train: " + todayFirstTrain);

  // Convert today's first train time to unix (as a number, not a string)
  var todayFirstTrainUnix = parseInt(todayFirstTrain.format("X"));
  console.log("Today's first train: " + todayFirstTrainUnix);

  // Set the current time in unix (number, not a string)
  var nowUnix = parseInt(moment().format("X"));
  console.log("Time now: " + nowUnix);

  // Convert user frequency (m) into seconds (number)
  var frequencySeconds = parseInt(tv.frequency * 60);

  // Create timeOfLastTrain variable
  var timeOfLastTrain = 0;

  // For-loop: start at the first train time and add the frequency (seconds) until the current time. This outputs the next train time (unix)
  for (
    timeOfLastTrain = todayFirstTrainUnix;
    timeOfLastTrain < nowUnix;
    timeOfLastTrain += frequencySeconds
  );
  console.log("Next train: " + timeOfLastTrain);

  // Convert next train time (unix) to a readable time ("HH:mm")
  var nextArrivalReadable = moment.unix(timeOfLastTrain).format("HH:mm");

  // Calculate minutes away
  var minutesAwayReadable = (timeOfLastTrain - nowUnix) / 60;

  // Display train frequency, next arrival, and minutes away
  var frequency = $("<div>")
    .attr("class", "col-2")
    .text(tv.frequency);
  var nextArrival = $("<div>")
    .attr("class", "col-2")
    .text(nextArrivalReadable);
  var minutesAway = $("<div>")
    .attr("class", "col-2")
    .text(minutesAwayReadable);

  // Create extra column and append everthing to the train schedule
  var extraDivSecond = $("<div>").attr("class", "col-1");
  row.append(
    extraDivFirst,
    trainName,
    destination,
    frequency,
    nextArrival,
    minutesAway,
    extraDivSecond
  );
  $("#train-card").append(row);
});
