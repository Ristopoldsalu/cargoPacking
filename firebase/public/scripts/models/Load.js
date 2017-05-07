app.factory('Load', function (PackageService) {

    function Load(number, cars, date, packages) {
        this.number = number;
        this.cars = cars;
        this.date = date;
        this.packages = packages;
    }

    Load.prototype.getSomethongsomething = function () {
        return this.name;
    };

    /**
     * Static method, assigned to class
     * Instance ('this') is not available in static context
     */
    Load.build = function (data) {
        return new Load(
            data.number,
            data.cars,
            data.date,
            PackageService.getPackages(data.packages) // another model
        );
    };

    /**
     * Return the constructor function
     */
    return Load;
});