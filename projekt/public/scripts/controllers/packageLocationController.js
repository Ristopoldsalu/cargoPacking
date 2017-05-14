app.controller('packLocaController',function ($scope, PackageTypeService, LocationService, Location, PackageType) {

    $scope.packageTypes = PackageTypeService.getPackageTypes();
    $scope.locations = LocationService.getLocations();

    $scope.packageText = "Uus pakk";
    $scope.locationText = "Uus asukoht";

    // Get the packageModal
    var packageModal = document.getElementById('packageTypeModal');
    var locationModal = document.getElementById('locationModal');
    var loadModal = document.getElementById('loadModal');
    var generationModal = document.getElementById('generationModal');

// Get the button that opens the packageModal
    var btn = document.getElementById("addPackageType");
    var btnLoca = document.getElementById("addLocation");
// Get the <span> element that closes the packageModal
    var span = document.getElementsByClassName("close")[0];
    var spanLoca = document.getElementsByClassName("close")[1];


    window.onclick = function(event) {
        if (event.target == packageModal) {
            packageModal.style.display = "none";
            $scope.packageText = "Uus pakk";
        }
        if (event.target == locationModal) {
            locationModal.style.display = "none";
        }
        if (event.target == loadModal) {
            loadModal.style.display = "none";
        }
        if (event.target == generationModal) {
            generationModal.style.display = "none";
        }
    };


// When the user clicks on the button, open the packageModal
    btn.onclick = function() {
        packageModal.style.display = "block";
    };
    btnLoca.onclick = function() {
        locationModal.style.display = "block";
    };

// When the user clicks on <span> (x), close the packageModal
    span.onclick = function() {
        packageModal.style.display = "none";
    };
    spanLoca.onclick = function() {
        locationModal.style.display = "none";
    };

// When the user clicks anywhere outside of the packageModal, close it

    
    $scope.editPackageType = function (packageOne) {
        $scope.packageTypeNameInput = packageOne.name;
        $scope.packageTypeHeightInput = packageOne.height;
        $scope.packageTypeWidthInput = packageOne.width;
        $scope.packageTypeColorInput = packageOne.color;
        $scope.packageText = packageOne.name;
        packageModal.style.display = "block";
    };

    $scope.deletePackageType = function (packageType) {
        PackageTypeService.deletePackageType(packageType);
    };

    $scope.addPackageType = function () {
        var packageType = new PackageType($scope.packageTypeNameInput, $scope.packageTypeHeightInput,
                                          $scope.packageTypeWidthInput, $scope.packageTypeColorInput);
        PackageTypeService.addPackageType(packageType);

        packageModal.style.display = "none";
        $scope.packageTypeNameInput = null;
        $scope.packageTypeHeightInput = null;
        $scope.packageTypeWidthInput= null;
        $scope.packageTypeColorInput= "#000000";
    };

    $scope.editLocation = function (location) {
        $scope.locationNameInput = location.name;
        $scope.locationAddressInput = location.address;
        locationModal.style.display = "block";
    };

    $scope.deleteLocation = function (location) {
        LocationService.deleteLocation(location);
    };

    $scope.addLocation = function () {
        var location = new Location($scope.locationNameInput, $scope.locationAddressInput);
        LocationService.addLocation(location);

        locationModal.style.display = "none";
        $scope.locationNameInput = null;
        $scope.locationAddressInput = null;
    };


});
