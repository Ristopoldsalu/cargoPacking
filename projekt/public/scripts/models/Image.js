app.factory('Image', function () {

    function Image(key, load, car, image) {
        this.key = key;
        this.load = load;
        this.car = car;
        this.image = image;
    }

    Image.build = function (data) {
        return new Image(
            data.key,
            data.load,
            data.car,
            data.image
        );
    };

    return Image;
});