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
    Package.prototype.hitTest = function(hitX,hitY, sizer) {
        var factor = 2000;
        return((hitX > this.x - this.packageType.width/factor*sizer)&&(hitX < this.x + this.packageType.width/factor*sizer)&&(hitY > this.y - this.packageType.height/factor*sizer)&&(hitY < this.y + this.packageType.height/factor*sizer));
    };
    Package.prototype.hitDeleteTest = function(hitX,hitY, sizer) {
        var factor = 2000;
        return ((hitX > this.x+this.packageType.width/factor*sizer-30)&&(hitX < this.x + this.packageType.width/factor*sizer)&&(hitY > this.y - this.packageType.height/factor*sizer)&&(hitY < this.y - this.packageType.height/factor*sizer + 30));
    };

//A function for drawing the particle.
    Package.prototype.drawToContext = function(theContext, sizer) {
        var factor = 1000;
        var pack = this;
        var packageTy = this.packageType;
        theContext.fillStyle = this.packageType.color;
        //pakk
        theContext.fillStyle = "#000000";
        theContext.rect(this.x - (this.packageType.width/factor/2*sizer),
                            this.y - (this.packageType.height/factor/2*sizer),
                            (this.packageType.width/factor*sizer),
                            (this.packageType.height/factor*sizer));
        theContext.stroke();
        theContext.fillStyle = this.packageType.color;
        theContext.fillRect(this.x - (this.packageType.width/factor/2*sizer)+1,
                            this.y - (this.packageType.height/factor/2*sizer)+1,
                            (this.packageType.width/factor*sizer)-1,
                            (this.packageType.height/factor*sizer)-1);

        theContext.fillStyle = this.destination.color;
        theContext.fillRect(this.x + (this.packageType.width/factor/4*sizer),
                            this.y - (this.packageType.height/factor/2*sizer)+1,
                            (this.packageType.width/factor/4*sizer)-1,
                            (this.packageType.height/factor*sizer)-1);
        /*
        theContext.fillStyle = "#000000";
        //ruut risti jaoks
        theContext.fillRect(this.x+this.packageType.width/factor/2*sizer-30, this.y - this.packageType.height/factor/2*sizer, 30, 30);
        //rist
        */


        theContext.beginPath();
        theContext.moveTo(this.x+this.packageType.width/factor/2*sizer-15 - 10, this.y-this.packageType.height/factor/2*sizer+15 - 10);
        theContext.lineTo(this.x+this.packageType.width/factor/2*sizer-15 + 10, this.y-this.packageType.height/factor/2*sizer+15 + 10);
        theContext.moveTo(this.x+this.packageType.width/factor/2*sizer-15 + 10, this.y-this.packageType.height/factor/2*sizer+15 - 10);
        theContext.lineTo(this.x+this.packageType.width/factor/2*sizer-15 - 10, this.y-this.packageType.height/factor/2*sizer+15 + 10);
        theContext.closePath();

        //tekst
        var textSizer = sizer;
        var textFits = false;
        theContext.fillStyle = '#000000';
        var font = textSizer/5;

        var packTypeTxt = this.packageType.name;
        var destTxt = ' -> ' +  this.destination.name;
        var sizeTxt = this.packageType.height + " X " + this.packageType.width;

        while(!textFits) {
            theContext.font = font + "px Arial";
            var typeTxtLength = theContext.measureText(packTypeTxt);
            var destTxtLength = theContext.measureText(packTypeTxt);
            var sizeTxtLength = theContext.measureText(sizeTxt);
            var height = typeTxtLength.height + destTxtLength.height + 10;
            var width = typeTxtLength.width+40+sizeTxt.width >  destTxtLength.width+15 ? typeTxtLength.width: destTxtLength.width;
            if (this.packageType.width/factor*sizer > width) {
                textFits = true;
                theContext.fillText(packTypeTxt, this.x-this.packageType.width/factor/2*sizer+10, this.y);
                if (this.x-this.packageType.width/factor/2*sizer+10+sizeTxt.width+20 > this.packageType.width/factor*sizer) {
                    theContext.fillText(sizeTxt, this.x-this.packageType.width/factor/2*sizer+10, this.y + 25);
                    theContext.fillText(destTxt, this.x-this.packageType.width/factor/2*sizer +10, this.y + 50);

                } else {
                    theContext.fillText(sizeTxt, this.x-this.packageType.width/factor/2*sizer+30+typeTxtLength.width, this.y);
                    theContext.fillText(destTxt, this.x-this.packageType.width/factor/2*sizer+10, this.y + 25);

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