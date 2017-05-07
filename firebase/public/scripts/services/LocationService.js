app.factory('LocationService', function ($firebaseObject, Location) {


    var rootRefLoca = firebase.database().ref().child('location');


    //getLocations
    this.getLocations = function () {
        var locaObj = $firebaseObject(rootRefLoca);
        locations = [];
        locaObj.$loaded().then(function() {
            angular.forEach(locaObj, function(value) {
                locations.push(Location.build(value));
            });
        });
        return locations;
    };

    return this;
});