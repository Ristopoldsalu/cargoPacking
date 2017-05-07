app.factory('LoadService', function ($firebaseObject, Load, PackageService) {


    var rootRefLoca = firebase.database().ref().child('load');
    var currentLoad = 100;
    //getLocations
    this.getLoads = function () {
        var loadObj = $firebaseObject(rootRefLoca);
        loads = [];
        loadObj.$loaded().then(function() {
            angular.forEach(loadObj, function(value) {
                loads.push(Load.build(value));
            });
        });
        return loads;
    };

    this.saveLoad = function (load, shapes) {

        var packageIds = [];
        angular.forEach(shapes, function (shape) {
            packageIds.push(shape.id);
        });
        var location = rootRefLoca.child(load.number);
        load.packages = packageIds;
        var loadSave = angular.copy(load);//for object cleaning
        location.set(loadSave);
        return true;
    };

    this.getCurrentLoad = function () {
        return currentLoad;
    };
    return this;
});