app.factory('PackageLoadDetailService', function ($firebaseObject, $firebaseArray, PackageLoadDetail) {

    var rootRefLoca = firebase.database().ref().child('package');

    var packageTypes = [];
    //getPackTypes

    //getPackagesByIds
    this.getPackageDetailsList = function (loadNumber) {
        var packageDetailsList = [];
        var packages = rootRefLoca.orderByChild("load").equalTo(loadNumber);

        var packagesObject = $firebaseArray(packages);
        packagesObject.$loaded().then(function(){
            angular.forEach(packagesObject, function (packageOne) {
                var exists = false;
                angular.forEach(packageDetailsList, function (detail) {
                    if (detail.packageType === packageOne.packageType.name && detail.destination === packageOne.destination.name
                        && detail.car === packageOne.car) {
                        detail.addCount();
                        exists = true;
                    }
                });
                if (!exists) {
                    packageDetailsList.push(new PackageLoadDetail(packageOne.packageType.name, packageOne.destination.name, packageOne.car));
                }
            })
        });

        return packageDetailsList;
    };

    this.getDetailList = function (shapes) {
        var details = [];
        angular.forEach(shapes, function (packageOne) {
            var exists = false;
            angular.forEach(details, function (detail) {
                if (detail.packageType === packageOne.packageType.name && detail.destination === packageOne.destination.name
                    && detail.car === packageOne.car) {
                    detail.addCount();
                    exists = true;
                }
            });
            if (!exists) {
                details.push(new PackageLoadDetail(packageOne.packageType.name, packageOne.destination.name, packageOne.car));
            }
        });
        return details;
    };

    return this;
});