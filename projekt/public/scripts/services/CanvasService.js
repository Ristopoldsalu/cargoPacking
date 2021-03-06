app.service('CanvasService', function (Load, Package, PackageLoadDetailService) {

    var shapes = [];
    var context;
    var theCanvas;
    var sizer = 130;


    var dragIndex;
    var dragging;
    var mouseX;
    var mouseY;
    var dragHoldX;
    var dragHoldY;
    var timer;
    var targetX;
    var targetY;
    var easeAmount;
    var curYPos, curXPos, curDown;
    var load;
    var tempX = 600;
    var tempY = 700;
    var canvasService = this;
    var CAR_HEIGHT = 2.6;
    var CAR_WIDTH = 13.6;
    var cars = 1;
    var activeCar = 1;
    var packsDetail = [];

    this.drawScreen = function () {
        if (context !== undefined) {
            //bg
            context.fillStyle = "#ECECEC";
            context.fillRect(0,0,theCanvas.width,theCanvas.height);
            context.fillStyle = "#000000";
            var font = sizer/5;
            context.font = font + "px Arial";
            context.fillText('Auto : ' + activeCar + "/" + cars, theCanvas.width/2 - 250,30);

            if (load !== undefined) {
                context.fillText('Nr. ' + load.number,theCanvas.width/2-50, 30);
                context.fillText('Kuupäev ' + load.date,theCanvas.width/2 + 200, 30);
            } else {
                context.fillText('Nr. ~',theCanvas.width/2-50, 30);
                context.fillText('Kuupäev ~',theCanvas.width/2 + 200, 30);
            }


            drawCars();
            drawPackDetails();
            this.drawShapes();
        }
    };

    this.drawWithoutShapes = function () {
        //bg
        context.clearRect(0, 0, theCanvas.width, theCanvas.height);
        context.fillStyle = "#ECECEC";
        context.fillRect(0,0,theCanvas.width,theCanvas.height);
        context.fillStyle = "#000000";
        var font = sizer/5;
        context.font = font + "px Arial";
        context.fillText('Auto : ' + activeCar, 25,15);
        drawCars();
    };

    drawCars = function () {
        context.fillStyle = "#000000";
        context.rect(theCanvas.width/2 - CAR_WIDTH*sizer/2,100,CAR_WIDTH*sizer,CAR_HEIGHT*sizer);
        context.rect(theCanvas.width/2 - CAR_WIDTH*sizer/2,500,CAR_WIDTH*sizer,CAR_HEIGHT*sizer);
        context.fillStyle = "#FFF6F6";
        context.fillRect(theCanvas.width/2 - CAR_WIDTH*sizer/2,100,CAR_WIDTH*sizer,CAR_HEIGHT*sizer);
        context.fillRect(theCanvas.width/2 - CAR_WIDTH*sizer/2,500,CAR_WIDTH*sizer,CAR_HEIGHT*sizer);
        context.stroke();
    };

    drawPackDetails = function () {
        context.fillStyle = "#000000";
        var font = sizer/5;
        context.font = font + "px Arial";
        var startX = 25;
        var startY = 900;
        angular.forEach(packsDetail, function (pack) {
            if (pack.car === activeCar) {
                context.fillText(pack.packageType + " - " + pack.destination + " X " + pack.count, startX,startY);
                startY = startY + 30;
            }
        });
    };

    this.drawShapes = function() {
        angular.forEach(shapes, function (shape) {
            if (shape.car === activeCar) {
                shape.drawToContext(context,sizer);
            }
        });
    };

    this.setShapes = function (shapesNew) {
        shapes.length = 0;
        angular.forEach(shapesNew, function (pack) {
            shapes.push(pack);
        });
    };

    this.canvasSupport = function() {
        return Modernizr.canvas;
    };

    this.makeOneShape = function(selectedPack, selectedLocation) {
        tempShape = new Package(null, tempX+=10, tempY+=10, selectedPack, selectedLocation, load.number, activeCar);
        shapes.push(tempShape);
        console.log('uus shape');
        this.getPacksDetail();
        this.drawScreen();
    };

    this.getPacksDetail = function () {
        packsDetail = PackageLoadDetailService.getDetailList(shapes);
    };

    this.canvasApp = function() {
        console.log('init');
        if (!this.canvasSupport()) {
            return;
        }

        theCanvas = document.getElementById("canvasOne");
        context = theCanvas.getContext("2d");
        context.scale(1,1);

        this.init();
    };

    this.mouseMoveListener = function(evt) {
        var factor = 1000;
        if (dragging) {
            var posX;
            var posY;
            var minX = shapes[shapes.length-1].packageType.width/factor/2*sizer;
            var maxX = theCanvas.width - shapes[shapes.length-1].packageType.width/factor/2*sizer;
            var minY = shapes[shapes.length-1].packageType.height/factor/2*sizer;
            var maxY = theCanvas.height - shapes[shapes.length-1].packageType.height/factor/2*sizer;

            //getting mouse position correctly
            var bRect = theCanvas.getBoundingClientRect();
            mouseX = (evt.clientX - bRect.left)*(theCanvas.width/bRect.width);
            mouseY = (evt.clientY - bRect.top)*(theCanvas.height/bRect.height);

            //clamp x and y positions to prevent object from dragging outside of canvas
            posX = mouseX - dragHoldX;
            posX = (posX < minX) ? minX : ((posX > maxX) ? maxX : posX);
            posY = mouseY - dragHoldY;
            posY = (posY < minY) ? minY : ((posY > maxY) ? maxY : posY);

            targetX = posX;
            targetY = posY;
        }
        if(curDown){
            window.scrollTo(document.body.scrollLeft + (curXPos - evt.pageX), document.body.scrollTop + (curYPos - evt.pageY));
        }
    };

    this.mouseDownListener = function(evt) {
        var i;
        var deleteIndex;
        var deleteShape = false;

        curYPos = evt.pageY;
        curXPos = evt.pageX;
        curDown = true;

        //getting mouse position correctly
        var bRect = theCanvas.getBoundingClientRect();
        mouseX = (evt.clientX - bRect.left)*(theCanvas.width/bRect.width);
        mouseY = (evt.clientY - bRect.top)*(theCanvas.height/bRect.height);

        /*
         Below, we find if a shape was clicked. Since a "hit" on a square or a circle has to be measured differently, the
         hit test is done using the hitTest() function associated to the type of particle. This function is an instance method
         for both the SimpleDiskParticle and SimpleSqureParticle classes we have defined with the external JavaScript sources.
         */
        for (i=0; i < shapes.length; i++) {
            if (shapes[i].hitDeleteTest(mouseX, mouseY, sizer)) {
                deleteIndex = i;
                deleteShape = true;

            } else if (shapes[i].hitTest(mouseX, mouseY, sizer)) {
                dragging = true;
                //the following variable will be reset if this loop repeats with another successful hit:
                dragIndex = i;
            }
        }

        if (dragging) {
            curDown = false;
            deleteShape = false;
            window.addEventListener("mousemove", canvasService.mouseMoveListener, false);
            console.log("mouseMoveListener");

            //place currently dragged shape on top
            shapes.push(shapes.splice(dragIndex,1)[0]);

            //shapeto drag is now last one in array
            dragHoldX = mouseX - shapes[shapes.length-1].x;
            dragHoldY = mouseY - shapes[shapes.length-1].y;

            //The "target" position is where the object should be if it were to move there instantaneously. But we will
            //set up the code so that this target position is approached gradually, producing a smooth motion.
            targetX = mouseX - dragHoldX;
            targetY = mouseY - dragHoldY;

            //start timer
            timer = setInterval(canvasService.onTimerTick, 1000/30);
        } else if (deleteShape) {
            curDown = false;
            shapes.splice(deleteIndex,1);
            canvasService.drawWithoutShapes();
            packsDetail = PackageLoadDetailService.getDetailList(shapes);
            canvasService.drawScreen();
        } else if (curDown){
            window.addEventListener("mousemove", canvasService.mouseMoveListener, false);
            console.log("mouseMoveListener");
        }
        theCanvas.removeEventListener("mousedown", canvasService.mouseDownListener, false);
        console.log("removmouseDownListener");

        window.addEventListener("mouseup", canvasService.mouseUpListener, false);
        console.log("mouseUpListener");


        //code below prevents the mouse down from having an effect on the main browser window:
        if (evt.preventDefault) {
            evt.preventDefault();
        } //standard
        else if (evt.returnValue) {
            evt.returnValue = false;
        } //older IE
        return false;
    };

    this.onTimerTick = function () {
        //because of reordering, the dragging shape is the last one in the array.
        shapes[shapes.length-1].x = shapes[shapes.length-1].x + easeAmount*(targetX - shapes[shapes.length-1].x);
        shapes[shapes.length-1].y = shapes[shapes.length-1].y + easeAmount*(targetY - shapes[shapes.length-1].y);

        //stop the timer when the target position is reached (close enough)
        if ((!dragging)&&(Math.abs(shapes[shapes.length-1].x - targetX) < 0.1) && (Math.abs(shapes[shapes.length-1].y - targetY) < 0.1)) {
            shapes[shapes.length-1].x = targetX;
            shapes[shapes.length-1].y = targetY;
            //stop timer:
            clearInterval(timer);
        }
        canvasService.drawScreen();
    };

    this.mouseUpListener = function(evt) {

        theCanvas.addEventListener("mousedown", canvasService.mouseDownListener, false);
        console.log("mouseDownListener");

        window.removeEventListener("mouseup", canvasService.mouseUpListener, false);
        console.log("removeMouseUpListener");
        if (dragging) {
            dragging = false;
            window.removeEventListener("mousemove", canvasService.mouseMoveListener, false);
            console.log("mouseMoveListener");

        }
        if (curDown) {
            curDown = false;
            window.removeEventListener("mousemove", canvasService.mouseMoveListener, false);
            console.log("mouseMoveListener");
        }
    };

    this.init = function() {
        console.log('teeb init');
        easeAmount = 0.45;

        //initiate Load
        this.initiateLoad();

        this.drawScreen();


        theCanvas.addEventListener("mousedown", this.mouseDownListener, false);
        console.log("mouseDownListener");

    };

    this.initiateLoad = function () {
        var rootRefLoca = firebase.database().ref().child('load');
        //getLoads
        rootRefLoca.orderByKey().once('value', function(snapshot) {
            if (snapshot.hasChildren()) {
                angular.forEach(snapshot.val(), function (load) {
                    loadNumber = load.number+1;
                });
            }
            load = new Load(null, loadNumber,1,new Date().toLocaleDateString(), [], []);
        });
    };

    this.addCar = function () {
        if (cars < 4) {
            cars = cars +1;
            load.cars = cars;
            activeCar = cars;
        }
        this.drawScreen();
    };
    this.removeCar = function () {
        if (confirm("Oled sa kindel, et soovid auto kustutada?(Kaovad ka auto peal olevad pakid)")) {
            for(var i = shapes.length -1; i >= 0 ; i--) {
                if (shapes[i].car === activeCar) {
                    shapes.splice(i, 1);
                } else if (shapes[i].car > activeCar) {
                    shapes[i].car = shapes[i].car-1;
                }
            }
            if (activeCar === cars) {
                activeCar = cars-1;
            }
            cars = cars - 1;
            load.cars = cars;
            this.drawScreen();
        }
    };

    this.getCanvas = function () {
        return theCanvas;
    };

    this.getLoad = function () {
        return load;
    };

    this.setLoad = function (loadNew) {
        load = loadNew;
    };

    this.getShapes = function () {
        return shapes;
    };

    this.getActiveCarsNumber = function() {
        return activeCar;
    };

    this.setActiveCarsNumber = function(number) {
        activeCar = number;
    };

    this.getCarsNumber = function() {
        return cars;
    };

    this.setCarsNumber = function(carsNumber) {
        cars = carsNumber;
    };


    this.changeToNextCar = function () {
        activeCar++;
        this.drawScreen();
    };

    this.changeToLastCar = function () {
        activeCar--;
        this.drawScreen();
    };
});
