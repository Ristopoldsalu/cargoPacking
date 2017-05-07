app.factory('PackageTypeService', function ($firebaseObject, $firebaseArray, PackageType) {

    var rootRefPack = firebase.database().ref().child('packagetype');

    var packageTypes = [];
    //getPackTypes

    rootRefPack.on('value', function (snapshot) {
        if (snapshot.val() !== null) {
            packageTypes.length = 0;

            angular.forEach(snapshot.val(), function (packType) {
                if(!packageTypeExists(packType)) {
                    packageTypes.push(packType);
                }
            });
        }
    });

    this.getPackageTypes = function () {
        return packageTypes;
    };

    //getPackageType
    this.getPackageType = function (id) {
        var packObj = $firebaseObject(firebase.database().ref().child('packageType/'+id));
        packObj.$loaded().then(function () {
            return PackageType.build(packObj);
        })
    };

    packageTypeExists = function (type) {
        angular.forEach(packageTypes, function (packageTypeExisting) {
            if (type.name === packageTypeExisting.name) {
                return true;
            }
        });
        return false;
    };

    this.deletePackageType = function (packageType) {
        rootRefPack.child(packageType.name).remove();
        if (packageTypes.length === 1) {
            packageTypes.length = 0;
        }
    };

    this.addPackageType = function (packageType) {
        if (!packageTypeExists(packageType)) {
            var ref = rootRefPack.child(packageType.name);
            ref.set(packageType);
        } else {
            alert("See paki tüüp juba eksisteerib");
        }
    };

    return this;
});