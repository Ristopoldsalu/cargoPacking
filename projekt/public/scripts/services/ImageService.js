app.factory('ImageService', function ($firebaseObject, Load, PackageService, CanvasService, Image) {


    var rootRefLoca = firebase.database().ref().child('image');

    //getImagesByLoad
    this.getImages = function (load) {
        var imageRef = rootRefLoca.orderByChild("load").equalTo(load.number);
        load.image = [];
        imageRef.once('value', function (snapshot) {
            angular.forEach(snapshot.val(), function (image) {
                load.image.push(Image.build(image));
            });
        });
    };

    this.saveImages = function (images) {
        angular.forEach(images, function (image) {
            var ref;
            if (image.key === null) {
                ref = rootRefLoca.push();
                image.key = ref.key;
            } else {
                ref = rootRefLoca.child(image.key);
            }
            var imageSave = angular.copy(image);//for object cleaning
            ref.set(imageSave);
            return true;
        });
    };

    this.deleteLoadImages = function (loadNumber) {
        var imageRef = rootRefLoca.orderByChild("load").equalTo(loadNumber);
        imageRef.once('value', function (snapshot) {
            angular.forEach(snapshot.val(), function (image) {
                deleteImage(image.key);
            });
        });
    };

    this.deleteImage = function (key) {
        rootRefLoca.child(key).remove();
    };



    return this;
});