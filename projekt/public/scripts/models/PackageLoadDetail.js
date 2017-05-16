app.factory('PackageLoadDetail', function () {

    function PackageLoadDetail(packageType, destination, car) {
        this.packageType = packageType;
        this.destination = destination;
        this.count = 1;
        this.car = car;
    }

    PackageLoadDetail.prototype.addCount = function () {
        this.count++;
    };

    return PackageLoadDetail;
});