app.factory('LoadService', function ($firebaseObject, Load, PackageService, CanvasService, ImageService) {


    var currentLoad;
    var currentShapes = [];
    var loads = [];

    var loadRef = firebase.database().ref().child('load');


    //getLoads
    loadRef.on('value', function (snapshot) {
        loads.length = 0;
        angular.forEach(snapshot.val(), function (load, key) {
            var loadObejct = Load.build(load, key);
            loads.push(loadObejct);
            ImageService.getImages(loadObejct);
        });
    });

    this.getLoads = function () {
        return loads;
    };

    this.saveLoad = function (load) {
        var ref;
        if (load.key === null) {
            ref = loadRef.push();
            load.key = ref.key;
        } else {
            ref = loadRef.child(load.key);
        }
        var loadSave = angular.copy(load);//for object cleaning
        ref.set(loadSave);
        return true;
    };

    this.getCurrentLoad = function () {
        return currentLoad;
    };

    this.setCurrentLoad = function (currLoad) {
        currentLoad = currLoad;
        CanvasService.setLoad(currLoad);
        PackageService.getPackages(currLoad.number);
        CanvasService.getPacksDetail();
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
        loadRef.endAt().limit(1).on('child_added', function(snapshot) {
            number = snapshot.number + 1;
        });
        return number;
    };

    this.deleteLoad = function (load) {
        var loadChild = loadRef.child(load.key).remove();
        return true;
    };

    return this;
});