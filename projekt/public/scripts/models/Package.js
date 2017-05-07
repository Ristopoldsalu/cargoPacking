app.factory('Package', function (PackageType, Location) {

    function Package(key, positionX, positionY, packageType, destination, load) {
        this.x = positionX;
        this.y = positionY;
        this.packageType = packageType;
        this.destination = destination;
        this.velX = 0;
        this.velY = 0;
        this.accelX = 0;
        this.accelY = 0;
        this.load = load;
        this.key = key;
    }

    /**
     * Static method, assigned to class
     * Instance ('this') is not available in static context
     */
    Package.build = function (data) {
        return new Package(
            data.key,
            data.x,
            data.y,
            PackageType.build(data.packageType),
            Location.build(data.destination),
            data.load
        );
    };

    /**
     * Return the constructor function
     */

//The function below returns a Boolean value representing whether the point with the coordinates supplied "hits" the particle.
    Package.prototype.hitTest = function(hitX,hitY, sizer) {
        return((hitX > this.x - this.packageType.width/2*sizer)&&(hitX < this.x + this.packageType.width/2*sizer)&&(hitY > this.y - this.packageType.height/2*sizer)&&(hitY < this.y + this.packageType.height/2*sizer));
    };
    Package.prototype.hitDeleteTest = function(hitX,hitY, sizer) {
        return ((hitX > this.x+this.packageType.width/2*sizer-30)&&(hitX < this.x + this.packageType.width/2*sizer)&&(hitY > this.y - this.packageType.height/2*sizer)&&(hitY < this.y - this.packageType.height/2*sizer + 30));
    };

//A function for drawing the particle.
    Package.prototype.drawToContext = function(theContext, sizer) {
        theContext.fillStyle = this.packageType.color;
        //pakk

        theContext.fillRect(this.x - (this.packageType.width/2*sizer), this.y - (this.packageType.height/2*sizer), (this.packageType.width*sizer), (this.packageType.height*sizer));

        //ruut risti jaoks
        theContext.fillRect(this.x+this.packageType.width/2*sizer-30, this.y - this.packageType.height/2*sizer, 30, 30);
        //rist
        theContext.stroke();


        theContext.beginPath();
        theContext.moveTo(this.x+this.packageType.width/2*sizer-15 - 10, this.y-this.packageType.height/2*sizer+15 - 10);
        theContext.lineTo(this.x+this.packageType.width/2*sizer-15 + 10, this.y-this.packageType.height/2*sizer+15 + 10);
        theContext.moveTo(this.x+this.packageType.width/2*sizer-15 + 10, this.y-this.packageType.height/2*sizer+15 - 10);
        theContext.lineTo(this.x+this.packageType.width/2*sizer-15 - 10, this.y-this.packageType.height/2*sizer+15 + 10);
        theContext.stroke();

        //tekst
        theContext.fillStyle = '#000000';
        var font = sizer/5;
        theContext.font = font + "px Arial";
        theContext.fillText('Pakk: ' + this.packageType.name, this.x-this.packageType.width/2*sizer+10, this.y);
        theContext.fillText('Sihtkoht: ' +  this.destination.name, this.x-10, this.y);
        theContext.fillText(this.packageType.height + " X " + this.packageType.width, this.x-this.packageType.width/2*sizer +10, this.y+sizer/5);
        theContext.stroke();

    };

    return Package;
});