app.factory('Location', function () {

    function Location(name, address) {
        this.name = name;
        this.address = address;
    }

    Location.prototype.getSomethongsomething = function () {
        return this.name;
    };
    /**
     * Static method, assigned to class
     * Instance ('this') is not available in static context
     */
    Location.build = function (data) {
        return new Location(
            data.name,
            data.address
        );
    };

    /**
     * Return the constructor function
     */
    return Location;
});