app.factory('PackageService', function ($firebaseObject, $firebaseArray, Package) {

    var rootRefLoca = firebase.database().ref().child('package');


    //getPackages
    this.getPackages = function () {
        var packObj = $firebaseArray(rootRefLoca);
        packages = [];
        packObj.$loaded().then(function() {
            angular.forEach(packObj, function(value) {
                pacakges.push(Package.build(value));
            });
        });
        return packages;
    };

    //getPackagesByIds
    this.getPackages = function (iDs) {
        packages = [];
        angular.forEach(iDs, function (id) {
            var packageObj = $firebaseObject(firebase.database().ref().child('package/'+id));
            packageObj.$loaded().then(function () {
                packages.push(Package.build(packageObj));
            })
        });
        return packages;
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
        rootRefLoca.setChildren(packages);
    };

    return this;



});