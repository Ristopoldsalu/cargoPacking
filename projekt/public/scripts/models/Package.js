app.factory('Package', function (PackageType, Location) {

    function Package(key, positionX, positionY, packageType, destination, load, car) {
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
        this.car = car;
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
            data.load,
            data.car
        );
    };

    /**
     * Return the constructor function
     */

//The function below returns a Boolean value representing whether the point with the coordinates supplied "hits" the particle.
    Package.prototype.hitTest = function(hitX,hitY, proportions) {
        var pack = this.packageType;
        var mFactor = 2*1000;
        return((hitX > this.x - pack.width/mFactor*proportions)
            &&(hitX < this.x + pack.width/mFactor*proportions)
            &&(hitY > this.y - pack.height/mFactor*proportions)
            &&(hitY < this.y + pack.height/mFactor*proportions));
    };
    Package.prototype.hitDeleteTest = function(hitX,hitY, sizer) {
        var factor = 2000;
        return ((hitX > this.x+this.packageType.width/factor*sizer-30)&&(hitX < this.x + this.packageType.width/factor*sizer)&&(hitY > this.y - this.packageType.height/factor*sizer)&&(hitY < this.y - this.packageType.height/factor*sizer + 30));
    };

//A function for drawing the particle.
    Package.prototype.drawToContext = function(theContext, proportions) {
        var factor = 1000;
        var pack = this.packageType;
        theContext.fillStyle = this.packageType.color;
        //pakk
        theContext.fillStyle = "#000000";
        theContext.rect(this.x - (pack.width/factor/2*proportions),
                            this.y - (pack.height/factor/2*proportions),
                            (pack.width/factor*proportions),
                            (pack.height/factor*proportions));
        theContext.stroke();
        theContext.fillStyle = pack.color;
        theContext.fillRect(this.x - (pack.width/factor/2*proportions)+1,
                            this.y - (pack.height/factor/2*proportions)+1,
                            (pack.width/factor*proportions)-1,
                            (pack.height/factor*proportions)-1);
        //sihtkoht
        theContext.fillStyle = this.destination.color;
        theContext.fillRect(this.x + (pack.width/factor/4*proportions),
                            this.y - (pack.height/factor/2*proportions)+1,
                            (pack.width/factor/4*proportions)-1,
                            (pack.height/factor*proportions)-1);

        theContext.beginPath();
        theContext.moveTo(this.x+pack.width/factor/2*proportions-15 - 10, this.y-pack.height/factor/2*proportions+15 - 10);
        theContext.lineTo(this.x+pack.width/factor/2*proportions-15 + 10, this.y-pack.height/factor/2*proportions+15 + 10);
        theContext.moveTo(this.x+pack.width/factor/2*proportions-15 + 10, this.y-pack.height/factor/2*proportions+15 - 10);
        theContext.lineTo(this.x+pack.width/factor/2*proportions-15 - 10, this.y-pack.height/factor/2*proportions+15 + 10);
        theContext.closePath();

        //tekst
        var textSizer = proportions;
        var textFits = false;
        theContext.fillStyle = '#000000';
        var font = textSizer/5;

        var packTypeTxt = pack.name;
        var destTxt = ' -> ' +  this.destination.name;
        var sizeTxt = pack.height + " X " + pack.width;
        //FIT TEXT
        while(!textFits) {
            theContext.font = font + "px Arial";
            var typeTxtLength = theContext.measureText(packTypeTxt);
            var destTxtLength = theContext.measureText(packTypeTxt);
            var sizeTxtLength = theContext.measureText(sizeTxt);
            var height = typeTxtLength.height + destTxtLength.height + 10;
            var width = typeTxtLength.width+40+sizeTxt.width >  destTxtLength.width+15 ? typeTxtLength.width: destTxtLength.width;
            if (pack.width/factor*proportions > width) {
                textFits = true;
                theContext.fillText(packTypeTxt, this.x-pack.width/factor/2*proportions+10, this.y);
                if (this.x-pack.width/factor/2*proportions+10+sizeTxt.width+20 > pack.width/factor*proportions) {
                    theContext.fillText(sizeTxt, this.x-pack.width/factor/2*proportions+10, this.y + 25);
                    theContext.fillText(destTxt, this.x-pack.width/factor/2*proportions +10, this.y + 50);

                } else {
                    theContext.fillText(sizeTxt, this.x-pack.width/factor/2*proportions+30+typeTxtLength.width, this.y);
                    theContext.fillText(destTxt, this.x-pack.width/factor/2*proportions+10, this.y + 25);

                }
            } else {
                textSizer = textSizer-10;
                font = textSizer/5;
            }

        }

        theContext.stroke();

    };

    return Package;
});