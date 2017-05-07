app.factory('LoadService', function ($firebaseObject, Load, PackageService, CanvasService) {


    var rootRefLoca = firebase.database().ref().child('load');
    var currentLoad;
    var currentShapes = [];
    var loads = [];


    //getLoads
    rootRefLoca.on('value', function (snapshot) {
        if (snapshot.val() !== null) {
            loads.length = 0;

            angular.forEach(snapshot.val(), function (load, key) {
                if(!loadExists(load)) {
                    loads.push(Load.build(load, key));
                }
            });
        }
    });

    this.getLoads = function () {
        return loads;
    };

    this.saveLoad = function (load) {
        var ref;
        if (load.key === null) {
            ref = rootRefLoca.push();
            load.key = ref.key;
        } else {
            ref = rootRefLoca.child(load.key);
        }
        var loadSave = angular.copy(load);//for object cleaning
        ref.set(loadSave);
        return true;
    };


/*
    ref.endAt().limit(1).on('child_added', function(snapshot) {

        // all records after the last continue to invoke this function
        console.log(snapshot.name(), snapshot.val());

    });*/

    this.getCurrentLoad = function () {
        return currentLoad;
    };

    this.setCurrentLoad = function (currLoad) {
        currentLoad = currLoad;
        CanvasService.setLoad(currLoad);
        PackageService.getPackages(currLoad.number);
        CanvasService.drawScreen();
    };

    this.getCurrentShapes = function () {
        return currentShapes;
    };

    this.setCurrentShapes = function (shapes) {
        currentShapes = shapes;
    };

    loadExists = function (load) {
        angular.forEach(loads, function (loadExisting) {
            if (load.number === loadExisting.number) {
                return true;
            }
        });
        return false;
    };

    this.getNextNumber = function () {
        var number = 0;
        rootRefLoca.endAt().limit(1).on('child_added', function(snapshot) {
            number = snapshot.number + 1;
        });
        return number;
    };


    return this;
});