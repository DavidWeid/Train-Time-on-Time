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

var database = firebase.database().ref("/trainInfo");

$(".carousel").carousel({
  interval: 1000
});

$("#submit-btn").on("click", function(event) {
  event.preventDefault();

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

  if (
    trainName === "" ||
    destination === "" ||
    firstTime === "" ||
    frequency === ""
  ) {

    console.log("All inputs required");

  } else {

    var addDataBase = database.push();

    addDataBase.set({
      trainName: trainName,
      destination: destination,
      firstTime: firstTime,
      frequency: frequency,
      dateAdded: firebase.database.ServerValue.TIMESTAMP
    });

    $("#name-input").val("");
    $("#destination-input").val("");
    $("#firstTime-input").val("");
    $("#frequency-input").val("");

  }
});

database.on("child_added", function(trainshot){
    console.log(trainshot.val());
    var tv = trainshot.val();
})