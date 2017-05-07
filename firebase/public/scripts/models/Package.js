app.factory('Package', function (PackageType, Location) {




    function Package(id, positionX, positionY, packageType, destination, load) {
        this.id = id;
        this.x = positionX;
        this.y = positionY;
        this.packageType = packageType;
        this.destination = destination;
        this.load = load;
        this.radius = packageType.getRadius();
        this.velX = 0;
        this.velY = 0;
        this.accelX = 0;
        this.accelY = 0;
    }
    
    Package.prototype.getSomethongsomething = function () {
        return this.name;
    };

    /**
     * Static method, assigned to class
     * Instance ('this') is not available in static context
     */
    Package.build = function (data) {

        return new Package(
            data.id,
            data.x,
            data.y,
            PackageType.build(data.packageType),
            Location.build(data.destination),
            Load.build(data.load)
        );
    };

    /**
     * Return the constructor function
     */

//The function below returns a Boolean value representing whether the point with the coordinates supplied "hits" the particle.
    Package.prototype.hitTest = function(hitX,hitY) {
        return((hitX > this.x - 2*this.radius)&&(hitX < this.x + 2*this.radius)&&(hitY > this.y - this.radius)&&(hitY < this.y + this.radius));
    };
    Package.prototype.hitDeleteTest = function(hitX,hitY) {
        return ((hitX > this.x+2*this.radius-10)&&(hitX < this.x + 2*this.radius)&&(hitY > this.y - this.radius)&&(hitY < this.y - this.radius + 10));
    };

//A function for drawing the particle.
    Package.prototype.drawToContext = function(theContext) {
        theContext.fillStyle = this.packageType.color;
        //pakk
        theContext.fillRect(this.x - 2*this.radius, this.y - this.radius, 4*this.radius, 2*this.radius);

        //ruut risti jaoks
        theContext.fillRect(this.x+2*this.radius-10, this.y - this.radius, 10, 10);
        //rist
        theContext.beginPath();
        theContext.moveTo(this.x+2*this.radius-5 - 5, this.y-this.radius+5 - 5);
        theContext.lineTo(this.x+2*this.radius-5 + 5, this.y-this.radius+5 + 5);
        theContext.moveTo(this.x+2*this.radius-5 + 5, this.y-this.radius+5 - 5);
        theContext.lineTo(this.x+2*this.radius-5 - 5, this.y-this.radius+5 + 5);
        theContext.stroke();
        //tekst
        theContext.fillStyle = '#000000';
        theContext.fillText('Pakk: ' + this.packageType.name, this.x-10, this.y);
        theContext.fillText('Sihtkoht: ' +  this.destination.name, this.x-this.radius, this.y+this.radius-10);
        theContext.fillText(this.packageType.height + " X " + this.packageType.width, this.x-10, this.y+10);
    };

    return Package;
});