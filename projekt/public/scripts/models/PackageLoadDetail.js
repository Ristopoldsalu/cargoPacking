app.factory('PackageLoadDetail', function () {

    function PackageLoadDetail(packageType, destination) {
        this.packageType = packageType;
        this.destination = destination;
        this.count = 1;
    }

    PackageLoadDetail.prototype.addCount = function () {
        this.count++;
    };

    return PackageLoadDetail;
});