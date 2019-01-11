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

  var database = firebase.database();