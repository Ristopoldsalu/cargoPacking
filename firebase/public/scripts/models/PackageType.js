app.factory('PackageType', function () {

    function PackageType(name, height, width, color) {
        this.name = name;
        this.height = height;
        this.width = width;
        this.color = color;
    }

    PackageType.prototype = {
        getRadius: function () {
            return 10;
        }
    };

    /**
     * Static method, assigned to class
     * Instance ('this') is not available in static context
     */
    PackageType.build = function (data) {
        return new PackageType(
            data.name,
            data.height,
            data.width,
            data.color
        );
    };

    /**
     * Return the constructor function
     */
    return PackageType;
});