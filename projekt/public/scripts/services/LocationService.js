app.factory('LocationService', function ($firebaseObject, Location) {


    var locationsRef = firebase.database().ref().child('locations');

    var locations = [];
    //getLocations
    locationsRef.on('value', function (snapshot) {
        if (snapshot.val() !== null) {
            locations.length = 0;

            angular.forEach(snapshot.val(), function (loca) {
                if(!locationExists(loca)) {
                    locations.push(loca);
                }
            });
        }
    });

    this.getLocations = function () {
        return locations;
    };

    this.deleteLocation = function (locat) {
        locationsRef.child(locat.name).remove();
        if (locations.length === 1) {
            locations.length = 0;
        }
    };

    this.addLocation = function (location) {
        if (!locationExists(location)) {
            var ref = locationsRef.child(location.name);
            ref.set(location);
        } else {
            alert("See asukoht juba eksisteerib");
        }
    };

    locationExists = function (loca) {
        angular.forEach(locations, function (locationExisting) {
            if (loca.name === locationExisting.name) {
                return true;
            }
        });
        return false;
    };

    return this;
});