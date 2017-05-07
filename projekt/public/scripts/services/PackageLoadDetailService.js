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
                if (packageDetailsList.length !== 0) {
                    angular.forEach(packageDetailsList, function (detail) {
                        if (detail.packageType === packageOne.packageType.name && detail.destination === packageOne.destination.name) {
                            detail.addCount();
                            exists = true;
                        }
                    });
                }
                if (!exists) {
                    packageDetailsList.push(new PackageLoadDetail(packageOne.packageType.name, packageOne.destination.name));
                }
            })
        });

        return packageDetailsList;
    };

    return this;
});