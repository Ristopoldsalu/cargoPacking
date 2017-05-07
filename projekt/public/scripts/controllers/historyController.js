app.controller('historyController',function ($scope, LoadService, CanvasService, $timeout, PackageLoadDetailService) {

    $scope.loads = LoadService.getLoads();
    $scope.loadNumber = 0;
    $scope.loadDate = "";
    var loadDetail = {};


    $scope.openLoad = function (load) {
        loadModal.style.display = "block";
        $scope.loadNumber = load.number;
        $scope.loadDate = load.date;
        loadDetail = load;
        document.getElementById("loadGraph").src = load.image;

        getPackageCounts();

    };

    getPackageCounts = function () {
        $scope.packageDetailsList = PackageLoadDetailService.getPackageDetailsList(loadDetail.number);
    };

    $scope.loadToCanvas = function () {
        loadModal.style.display = "none";
        LoadService.setCurrentLoad(loadDetail);
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

    window.onclick = function(event) {

    };

});
