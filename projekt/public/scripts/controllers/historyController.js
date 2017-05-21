app.controller('historyController',function ($scope, LoadService, CanvasService, $timeout, PackageLoadDetailService, PackageService, ImageService) {

    $scope.loads = LoadService.getLoads();

    $scope.loadNumber = 0;
    $scope.loadDate = "";
    var loadDetail = {};
    $scope.loadImages = [];

    $scope.openLoad = function (load) {
        loadModal.style.display = "block";
        $scope.loadNumber = load.number;
        $scope.loadDate = load.date;
        loadDetail = load;
        $scope.loadImages = load.image;
        //document.getElementById("loadGraph").src = load.image.image;
        if (load.cars > 1){
            document.getElementById("nextCar").style.display = 'block';
        } else {
            document.getElementById("nextCar").style.display = 'none';
            document.getElementById("lastCar").style.display = 'none';
        }
        getPackageCounts();

    };

    getPackageCounts = function () {
        $scope.packageDetailsList = PackageLoadDetailService.getPackageDetailsList(loadDetail.number);
    };

    $scope.loadToCanvas = function () {
        loadModal.style.display = "none";
        LoadService.setCurrentLoad(loadDetail);
        CanvasService.setLoad(loadDetail);
        CanvasService.setCarsNumber(loadDetail.cars);
        CanvasService.getPacksDetail();
        CanvasService.drawScreen();
        clickOnUpload();
    };

    clickOnUpload = function() {
        $timeout(function() {
            angular.element('#defaultOpen').triggerHandler('click');
        });
    };

    var loadModal = document.getElementById('loadModal');
// Get the <span> element that closes the packageModal
    var loadSpan = document.getElementsByClassName("closeModal")[0];

// When the user clicks on <span> (x), close the packageModal
    loadSpan.onclick = function() {
        loadModal.style.display = "none";
    };

    $scope.deleteLoad = function (load) {

        if (LoadService.deleteLoad(load)) {
            PackageService.deleteLoadPackages(load.number);
            ImageService.deleteLoadImages(load.number);
            alert("Kustutatud!");
        }
    };

    $scope.printImage = function (image) {
        window.open().location = image.image;
    };



});
