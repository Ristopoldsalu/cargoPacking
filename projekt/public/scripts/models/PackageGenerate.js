app.factory('PackageGenerate', function () {

    var id = 1;
    function PackageGenerate(packageType, destination, count, car) {
        this.packageType = packageType;
        this.destination = destination;
        this.car = car;
        this.id = id++;
        this.count = count;
    }

    return PackageGenerate;
});