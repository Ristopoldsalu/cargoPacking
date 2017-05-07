app.factory('PackageTypeService', function ($firebaseObject, $firebaseArray, PackageType) {

    var rootRefPack = firebase.database().ref().child('packagetype');

    //getPackTypes
    this.getPackageTypes = function () {
        var packObj = $firebaseArray(rootRefPack);
        packageTypes = [];
        packObj.$loaded().then(function() {
            angular.forEach(packObj, function(value, key) {
                packageTypes.push(PackageType.build(value));
                console.log(packageTypes);
            });
        });

        return packageTypes;
    };

    //getPackageType
    this.getPackageType = function (id) {
        var packObj = $firebaseObject(firebase.database().ref().child('packageType/'+id));
        packObj.$loaded().then(function () {
            return PackageType.build(packObj);
        })
    };


    return this;
});