app.factory('PackageGenerate', function () {

    var id = 1;
    function PackageGenerate(packageType, destination, count) {
        this.packageType = packageType;
        this.destination = destination;
        this.id = id++;
        this.count = count;
    }

    return PackageGenerate;
});