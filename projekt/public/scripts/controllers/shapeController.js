app.controller('packingController',function ($scope, $firebaseObject, PackageTypeService,
LocationService, Package, LoadService, Load, PackageService, CanvasService, PackageGenerate, Image, ImageService) {

    var shapes;
    var canvasWidth = 1000;
    var canvasHeight = 600;
    var canvasOne = $('#canvasOne');
    var next = document.getElementById("nextCar");
    var last = document.getElementById("lastCar");
    next.style.display = 'none';
    last.style.display = 'none';


    //getPackTypes
    $scope.packageTypes = PackageTypeService.getPackageTypes();
    //getLocations
    $scope.locationsShape = LocationService.getLocations();

    $scope.packsToGenerate = [];
    $scope.packsToGenerate.push(new PackageGenerate(null,null,1));

    //initiate canvas
    $scope.onCanvasLoadTick = function() {
        if (('#canvasOne') !== null) {
            CanvasService.canvasApp();
            clearInterval($scope.loadTimer);
        }
        console.log("INTERVAL STILL GOING")
    };

    $scope.onCanvasLoadTickLoad = function() {
        if (CanvasService.getLoad() !== null) {
            CanvasService.drawScreen();
            clearInterval($scope.loadTimerLoad);
        }
        console.log("INTERVAL STILL GOINGLoad")
    };
    $scope.loadTimer = setInterval($scope.onCanvasLoadTick(), 1000/15);
    $scope.loadTimerLoad = setInterval($scope.onCanvasLoadTickLoad(), 1000/15);

    //addOneShape
    $scope.addShape = function () {
        CanvasService.makeOneShape($scope.selectedpack, $scope.selectedLocation);
    };

    //saveLoad
    $scope.saveLoad = function () {
        var saveLoad = CanvasService.getLoad();
        saveLoad.image = null;
        var images = [];
        var i = 1;
        var activeCar = CanvasService.getActiveCarsNumber();

        for (i; i < saveLoad.cars+1; i++) {
            CanvasService.setActiveCarsNumber(i);
            CanvasService.drawScreen();
            var image = new Image(null, saveLoad.number, i, CanvasService.getCanvas().toDataURL("image/png"));
            images.push(image);
        }
        CanvasService.setActiveCarsNumber(activeCar);
        CanvasService.drawScreen();

        if (LoadService.saveLoad(saveLoad)) {
            ImageService.saveImages(images);
            PackageService.savePackages(CanvasService.getShapes());
            alert("Salvestatud");
        }
    };

    $scope.saveAsNewLoad = function () {
        if (CanvasService.getLoad().key !== null) {
            CanvasService.initiateLoad();
            var load = null;
            var load = CanvasService.getLoad();
            var check = function () {
                if (load !== null || load !== undefined) {
                    angular.forEach(shapes, function (shape) {
                        shape.load = load.number;
                        shape.key = null;
                    })
                }
                else {
                    setTimeout(check, 500);
                }
            };
            check();
        }
        CanvasService.saveLoad();
    };

    $scope.printImage = function () {
        window.open().location = CanvasService.getCanvas().toDataURL("image/png");
    };

    $scope.addCar = function () {
        next.style.display = 'none';
        last.style.display = 'block';
        CanvasService.addCar();
    };

    $scope.removeCar = function () {
        next.style.display = 'none';
        last.style.display = 'block';
        CanvasService.removeCar();
    };


//For debug messages
    var Debugger = function() { };
    Debugger.log = function(message) {
        try {
            console.log(message);
        }
        catch (exception) {
        }
    };
    var generationModal = document.getElementById('generationModal');
    $scope.openGeneration = function () {
        generationModal.style.display = "block";
    };

    $scope.addNewPackRow = function () {
        $scope.packsToGenerate.push(new PackageGenerate(null,null,1));
        console.log($scope.packsToGenerate);
    };

    $scope.addPacksToCanvas = function () {
        var error = false;
        angular.forEach($scope.packsToGenerate, function (generatePack) {
            if (generatePack.packageType === null || generatePack.destination === null) {
                error = true;

            }
        });
        if (!error) {
            angular.forEach($scope.packsToGenerate, function (generatePack) {
                var i = 0;
                for (i; i < generatePack.count; i++) {
                    CanvasService.makeOneShape(generatePack.packageType, generatePack.destination);
                }
            });
            generationModal.style.display = "none";
        } else {
            alert("Palun vali kõik pakid");
        }
    };

    $scope.changeToLastCar = function () {
        if (CanvasService.getActiveCarsNumber() > 1) {
            if (CanvasService.getActiveCarsNumber()-1 === 1) {
                next.style.display = 'block';
                last.style.display = 'none';
            } else {
                next.style.display = 'block';
                last.style.display = 'block';
            }
            CanvasService.changeToLastCar();
        }
    };

    $scope.changeToNextCar = function () {
        if (CanvasService.getActiveCarsNumber() < CanvasService.getCarsNumber()) {
            if (CanvasService.getActiveCarsNumber() === CanvasService.getCarsNumber() - 1) {
                next.style.display = 'none';
                last.style.display = 'block';
            } else {
                next.style.display = 'block';
                last.style.display = 'block';
            }
            CanvasService.changeToNextCar();
        }
    };

    $scope.closeModal = function () {
        document.getElementById('generationModal').style.display = 'none';
    };

    $scope.removeGenerateRow = function (generatePackage) {
        var i = 0;
        for(i; i < $scope.packsToGenerate.length;i++){
            if (generatePackage.id === $scope.packsToGenerate[i].id) {
                $scope.packsToGenerate.splice(i,1);
                break;
            }
        }
    }
});

