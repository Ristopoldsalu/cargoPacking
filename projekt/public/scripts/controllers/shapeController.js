app.controller('packingController',function ($scope, $firebaseObject, PackageTypeService,
LocationService, Package, LoadService, Load, PackageService, CanvasService, PackageGenerate, Image, ImageService) {

    var shapes;
    var canvasWidth = 1000;
    var canvasHeight = 600;
    var canvasOne = $('#canvasOne');
    var next = document.getElementById("nextCar");
    var last = document.getElementById("lastCar");
    var deleteCar = document.getElementById("deleteCar");
    deleteCar.style.display = 'none';


    $scope.checkArrows = function () {
        if (CanvasService.getActiveCarsNumber() === 1) {
            last.style.display = 'none';
        } else {
            last.style.display = 'block';
        }
        if (CanvasService.getActiveCarsNumber() === CanvasService.getCarsNumber()) {
            next.style.display = 'none';
        } else {
            next.style.display = 'block';
        }
    };
    //getPackTypes
    $scope.packageTypes = PackageTypeService.getPackageTypes();
    //getLocations
    $scope.locationsShape = LocationService.getLocations();

    $scope.packsToGenerate = [new PackageGenerate(null,null,1)];

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
        var images = angular.copy(saveLoad.image);
        var i = 1;
        var b = 1;
        var activeCar = CanvasService.getActiveCarsNumber();

        if (images === null || images === undefined) {
            images = [];
        }
        for (i; i <= saveLoad.cars; i++) {
            CanvasService.setActiveCarsNumber(i);
            CanvasService.drawScreen();
            var foundImage = false;
            for (b; b < images.length; b++) {
                if (images[b].car === activeCar) {
                    images[b].image = CanvasService.getCanvas().toDataURL("image/png");
                    foundImage = true;
                }
            }
            if (!foundImage){
                var image = new Image(null, saveLoad.number, i, CanvasService.getCanvas().toDataURL("image/png"));
                images.push(image);
            }
        }
        CanvasService.setActiveCarsNumber(activeCar);
        CanvasService.drawScreen();

        if (saveLoad.packages === undefined || saveLoad.packages === null) {
            saveLoad.packages = [];
        } else {
            saveLoad.packages.length = 0;
        }
        angular.forEach(CanvasService.getShapes(), function (package) {
            saveLoad.packages.push(package.key);
        });

        saveLoad.image = null;
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
                    angular.forEach(CanvasService.getShapes(), function (shape) {
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
        $scope.saveLoad();
    };

    $scope.printImage = function () {
        window.open().location = CanvasService.getCanvas().toDataURL("image/png");
    };

    $scope.addCar = function () {
        deleteCar.style.display = 'block';
        CanvasService.addCar();
        $scope.checkArrows();
    };

    $scope.removeCar = function () {
        CanvasService.removeCar();
        $scope.checkArrows();
        if (CanvasService.getCarsNumber() === 1) {
            deleteCar.style.display = 'none';
        }
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
            $scope.packsToGenerate.length = 0;
            $scope.packsToGenerate.push(new PackageGenerate(null, null, 1))
            generationModal.style.display = "none";
        } else {
            alert("Palun vali kõik pakid");
        }
    };

    $scope.changeToLastCar = function () {
        if (CanvasService.getActiveCarsNumber() > 1) {
            CanvasService.changeToLastCar();
            $scope.checkArrows();
        }
    };

    $scope.changeToNextCar = function () {
        if (CanvasService.getActiveCarsNumber() < CanvasService.getCarsNumber()) {
            CanvasService.changeToNextCar();
            $scope.checkArrows();
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
    };

    $scope.checkArrows();

});

