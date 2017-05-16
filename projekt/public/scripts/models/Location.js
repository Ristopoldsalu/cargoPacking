app.factory('Location', function () {

    function Location(name, address, color) {
        this.name = name;
        this.address = address;
        this.color = color;
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
            data.address,
            data.color
        );
    };

    /**
     * Return the constructor function
     */
    return Location;
});