app.factory('PackageService', function ($firebaseObject, $firebaseArray, Package, CanvasService) {

    var rootRefLoca = firebase.database().ref().child('package');

    var packages = [];
    //getPackages
    this.getPackages = function () {
        var packObj = $firebaseArray(rootRefLoca);
        packages.length = 0;
        packObj.$loaded().then(function() {
            angular.forEach(packObj, function(value) {
                pacakges.push(Package.build(value));
            });
        });
        return packages;
    };

    //getPackagesByIds
    this.getPackages = function (loadNumber) {
        var packs = [];
        var packages = rootRefLoca.orderByChild("load").equalTo(loadNumber);

        var packagesObject = $firebaseArray(packages);
        packagesObject.$loaded().then(function(){

            angular.forEach(packagesObject,function (pack) {
                packs.push(Package.build(pack));
            });
            CanvasService.setShapes(packs);
            CanvasService.getPacksDetail();
            CanvasService.drawScreen();
        });

        // packages.length = 0;
        // angular.forEach(iDs, function (id) {
        //     var packageObj = $firebaseObject(firebase.database().ref().child('package/'+id));
        //     packageObj.$loaded().then(function () {
        //         packages.push(Package.build(packageObj));
        //         CanvasService.drawScreen();
        //     })
        // });
        // return packages;
        return packs;
    };

    //getPackage
    this.getPackage = function (id) {
        var packObj = $firebaseObject(firebase.database().ref().child('package/'+id));
        packObj.$loaded().then(function () {
            return Package.build(packObj);
        })
    };

    //savePackages
    this.savePackages = function (packages) {
        var packageIds = [];
        angular.forEach(packages, function (packageOne) {
            var ref;

            if (packageOne.key === null) {
                ref = rootRefLoca.push();
                packageOne.key = ref.key;
            } else {
                ref = rootRefLoca.child(packageOne.key);
            }
            packageIds.push(ref.key);
            var packageClean = angular.copy(packageOne);//for object cleaning
            ref.set(packageClean);
        });
        return packageIds;
    };

    this.deleteLoadPackages = function (loadNumber) {
        var packages = rootRefLoca.orderByChild("load").equalTo(loadNumber);

        var packagesObject = $firebaseArray(packages);
        packagesObject.$loaded().then(function(){

            angular.forEach(packagesObject,function (pack) {
                deletePackage(pack.key);
            });
        });
    };

    deletePackage = function (key) {
        rootRefLoca.child(key).remove();
    };

    return this;



});