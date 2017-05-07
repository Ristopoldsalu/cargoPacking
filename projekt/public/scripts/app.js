// Initialize Firebase
var config = {
    apiKey: "AIzaSyAhXXEJ6CuAx79L94wqXPjnGxOV2R3u9Ec",
    authDomain: "packingapp-1b9e2.firebaseapp.com",
    databaseURL: "https://packingapp-1b9e2.firebaseio.com",
    storageBucket: "packingapp-1b9e2.appspot.com",
    messagingSenderId: "928190293827"
};
firebase.initializeApp(config);

var app = angular.module('Myapp', ['firebase']);

