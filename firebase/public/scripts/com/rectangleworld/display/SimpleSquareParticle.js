// Simple class example
function SimpleSquareParticle(posX, posY, selectedPack, selectedLocation) {
		this.x = posX;
		this.y = posY;
		this.velX = 0;
		this.velY = 0;
		this.accelX = 0;
		this.accelY = 0;
		this.color = "#FF0000";
		this.radius = 10;
		this.pakiNimi = selectedPack;
		this.pakiSihtkoht = selectedLocation;
}

//The function below returns a Boolean value representing whether the point with the coordinates supplied "hits" the particle.
SimpleSquareParticle.prototype.hitTest = function(hitX,hitY) {
	return((hitX > this.x - 2*this.radius)&&(hitX < this.x + 2*this.radius)&&(hitY > this.y - this.radius)&&(hitY < this.y + this.radius));
}
SimpleSquareParticle.prototype.hitDeleteTest = function(hitX,hitY) {
	return ((hitX > this.x+2*this.radius-10)&&(hitX < this.x + 2*this.radius)&&(hitY > this.y - this.radius)&&(hitY < this.y - this.radius + 10));
}

//A function for drawing the particle.
SimpleSquareParticle.prototype.drawToContext = function(theContext) {
	theContext.fillStyle = this.color;
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
	theContext.fillText('Pakk: ' + this.pakiNimi, this.x-10, this.y);
	theContext.fillText('Sihtkoht: ' +  this.pakiSihtkoht, this.x-this.radius, this.y+this.radius-10);
}