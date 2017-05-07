app.controller('packingController',function ($scope, $firebaseObject, PackageTypeService,
LocationService, Package, LoadService, Load, PackageService, CanvasService, PackageGenerate) {

    var shapes;
    var canvasWidth = 1000;
    var canvasHeight = 600;
    var canvasOne = $('#canvasOne');


    //getPackTypes
    $scope.packageTypes = PackageTypeService.getPackageTypes();
    //getLocations
    $scope.locationsShape = LocationService.getLocations();

    $scope.generativePacks = [];
    $scope.generativePacks.push(new PackageGenerate(null,null,1));

    //initiate canvas
    $scope.onCanvasLoadTick = function() {
        if (('#canvasOne') !== null) {
            //stop timer:
            clearInterval($scope.loadTimer);
            CanvasService.canvasApp();
        }
    };
    $scope.loadTimer = setInterval($scope.onCanvasLoadTick(), 1000/15);

    //addOneShape
    $scope.addShape = function () {
        CanvasService.makeOneShape($scope.selectedpack, $scope.selectedLocation);
    };

    //saveLoad
    $scope.saveLoad = function () {
        var saveLoad = CanvasService.getLoad();
        saveLoad.image = CanvasService.getCanvas().toDataURL("image/png");

        if (LoadService.saveLoad(saveLoad)) {
            var packageIds = PackageService.savePackages(CanvasService.getShapes());
            alert("Salvestatud");
        }
    };

    $scope.printImage = function () {
        window.open().location = CanvasService.getCanvas().toDataURL("image/png");
    };

    $scope.addCar = function () {
        canvasOne.width(canvasOne.width + 400);
        canvasOne.height(canvasOne.height + 400);
        CanvasService.addCar();
    };

    $scope.removeCar = function () {
        canvasOne.width(canvasOne.width - 400);
        canvasOne.height(canvasOne.height - 400);
        CanvasService.removeCar();
    };

    //ZOOMING
    $scope.zoomIn = function() {
        canvasWidth = canvasWidth + 100;
        canvasHeight = canvasHeight + 100;
        canvasOne.width(canvasWidth);
        canvasOne.height(canvasHeight);
    };
    $scope.zoomOut = function () {
        canvasWidth = canvasWidth - 100;
        canvasHeight = canvasHeight - 100;
        canvasOne.width(canvasWidth);
        canvasOne.height(canvasHeight);
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
        $scope.generativePacks.push(new PackageGenerate(null,null,1));
        console.log($scope.generativePacks);
    };

    $scope.addPacksToCanvas = function () {
        angular.forEach($scope.generativePacks, function (generatePack) {
            if (generatePack.packageType !== null && generatePack.destination !== null) {
                var i = 0;
                for (i; i < generatePack.count; i++) {
                    CanvasService.makeOneShape(generatePack.packageType, generatePack.destination);
                }
            }
        });
        generationModal.style.display = "none";
    }
});

