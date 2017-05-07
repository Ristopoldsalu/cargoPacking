app.factory('Load', function () {

    function Load(key, number, cars, date, image) {
        this.number = number;
        this.cars = cars;
        this.date = date;
        this.image = image;
        this.key = key;
    }

    Load.build = function (data) {
        return new Load(
            data.key,
            data.number,
            data.cars,
            data.date,
            data.image
        );
    };

    return Load;
});