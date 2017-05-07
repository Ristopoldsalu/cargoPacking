app.service('CanvasService', function (Load, Package) {

    var shapes = [];
    var context;
    var theCanvas;
    var sizer = 60;

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

    this.drawScreen = function () {
        //bg
        context.fillStyle = "#ECECEC";
        context.fillRect(0,0,theCanvas.width,theCanvas.height);
        context.fillStyle = "#000000";
        context.stroke();
        drawCars();

        this.drawShapes();
    };

    drawCars = function () {
        if (cars === 1) {
            sizer = 130;
            context.fillStyle = "#000000";
            context.rect(20,100,CAR_WIDTH*sizer,CAR_HEIGHT*sizer);
            context.rect(20,500,CAR_WIDTH*sizer,CAR_HEIGHT*sizer);
            context.fillStyle = "#FFF6F6";
            context.fillRect(20,100,CAR_WIDTH*sizer,CAR_HEIGHT*sizer);
            context.fillRect(20,500,CAR_WIDTH*sizer,CAR_HEIGHT*sizer);
        } else if (cars === 2) {
            context.fillStyle = "#000000";
            context.rect(20,100,CAR_WIDTH*sizer,CAR_HEIGHT*sizer);
            context.rect(20,500,CAR_WIDTH*sizer,CAR_HEIGHT*sizer);
            context.fillStyle = "#FFF6F6";
            context.fillRect(20,100,CAR_WIDTH*sizer,CAR_HEIGHT*sizer);
            context.fillRect(20,500,CAR_WIDTH*sizer,CAR_HEIGHT*sizer);

            context.fillStyle = "#000000";
            context.rect(20,100,CAR_WIDTH*sizer,CAR_HEIGHT*sizer);
            context.rect(20,900,CAR_WIDTH*sizer,CAR_HEIGHT*sizer);
            context.fillStyle = "#FFF6F6";
            context.fillRect(20,100,CAR_WIDTH*sizer,CAR_HEIGHT*sizer);
            context.fillRect(20,900,CAR_WIDTH*sizer,CAR_HEIGHT*sizer);
            /*
            sizer = 95;
            context.fillStyle = "#000000";
            context.rect(20,100,CAR_WIDTH*sizer,CAR_HEIGHT*sizer);
            context.rect(20,680,CAR_WIDTH*sizer,CAR_HEIGHT*sizer);

            context.rect(450,395,CAR_WIDTH*sizer,CAR_HEIGHT*sizer);
            context.rect(450,920,CAR_WIDTH*sizer,CAR_HEIGHT*sizer);
            context.fillStyle = "#FFF6F6";
            context.fillRect(20,100,CAR_WIDTH*sizer,CAR_HEIGHT*sizer);
            context.fillRect(20,680,CAR_WIDTH*sizer,CAR_HEIGHT*sizer);

            context.fillRect(450,395,CAR_WIDTH*sizer,CAR_HEIGHT*sizer);
            context.fillRect(450,920,CAR_WIDTH*sizer,CAR_HEIGHT*sizer);
            */
        } else if (cars === 3) {
            context.fillStyle = "#000000";
            context.rect(20,100,CAR_WIDTH*sizer,CAR_HEIGHT*sizer);
            context.rect(20,500,CAR_WIDTH*sizer,CAR_HEIGHT*sizer);
            context.fillStyle = "#FFF6F6";
            context.fillRect(20,100,CAR_WIDTH*sizer,CAR_HEIGHT*sizer);
            context.fillRect(20,500,CAR_WIDTH*sizer,CAR_HEIGHT*sizer);

            context.fillStyle = "#000000";
            context.rect(20,100,CAR_WIDTH*sizer,CAR_HEIGHT*sizer);
            context.rect(20,900,CAR_WIDTH*sizer,CAR_HEIGHT*sizer);
            context.fillStyle = "#FFF6F6";
            context.fillRect(20,100,CAR_WIDTH*sizer,CAR_HEIGHT*sizer);
            context.fillRect(20,900,CAR_WIDTH*sizer,CAR_HEIGHT*sizer);

            context.fillStyle = "#000000";
            context.rect(20,100,CAR_WIDTH*sizer,CAR_HEIGHT*sizer);
            context.rect(20,1300,CAR_WIDTH*sizer,CAR_HEIGHT*sizer);
            context.fillStyle = "#FFF6F6";
            context.fillRect(20,100,CAR_WIDTH*sizer,CAR_HEIGHT*sizer);
            context.fillRect(20,1300,CAR_WIDTH*sizer,CAR_HEIGHT*sizer);
            /*
            sizer = 60;
            context.fillStyle = "#000000";
            context.rect(20,100,CAR_WIDTH*sizer,CAR_HEIGHT*sizer);
            context.rect(20,300,CAR_WIDTH*sizer,CAR_HEIGHT*sizer);
            context.rect(20,500,CAR_WIDTH*sizer,CAR_HEIGHT*sizer);

            context.rect(700,100,CAR_WIDTH*sizer,CAR_HEIGHT*sizer);
            context.rect(700,300,CAR_WIDTH*sizer,CAR_HEIGHT*sizer);
            context.rect(700,500,CAR_WIDTH*sizer,CAR_HEIGHT*sizer);
            context.fillStyle = "#FFF6F6";
            context.fillRect(20,100,CAR_WIDTH*sizer,CAR_HEIGHT*sizer);
            context.fillRect(20,300,CAR_WIDTH*sizer,CAR_HEIGHT*sizer);
            context.fillRect(20,500,CAR_WIDTH*sizer,CAR_HEIGHT*sizer);

            context.fillRect(700,100,CAR_WIDTH*sizer,CAR_HEIGHT*sizer);
            context.fillRect(700,300,CAR_WIDTH*sizer,CAR_HEIGHT*sizer);
            context.fillRect(700,500,CAR_WIDTH*sizer,CAR_HEIGHT*sizer);
            */
        }
        context.stroke();
    };

    this.drawShapes = function() {
        var i = 0;
        angular.forEach(shapes, function (shape) {
            shape.drawToContext(context,sizer);
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
        tempShape = new Package(null, tempX+=10, tempY+=10, selectedPack, selectedLocation, load.number);
        shapes.splice(0,0,tempShape);
        console.log('uus shape');
        this.drawScreen();
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
        if (dragging) {
            var posX;
            var posY;
            var minX = shapes[shapes.length-1].packageType.width/2*sizer;
            var maxX = theCanvas.width - shapes[shapes.length-1].packageType.width/2*sizer;
            var minY = shapes[shapes.length-1].packageType.height/2*sizer;
            var maxY = theCanvas.height - shapes[shapes.length-1].packageType.height/2*sizer;

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
        initiateLoad();

        this.drawScreen();


        theCanvas.addEventListener("mousedown", this.mouseDownListener, false);
        console.log("mouseDownListener");

    };

    initiateLoad = function () {
        var rootRefLoca = firebase.database().ref().child('load');
        //getLoads
        var number = 0;
        var loads = 0;
        rootRefLoca.once('value', function(snapshot) {
            if (snapshot.hasChildren()) {
                rootRefLoca.endAt().limitToFirst(1).on('child_added', function(snapshot) {
                    load = new Load(null, snapshot.val().number+1,1,new Date().toLocaleDateString(),[]);
                });
            } else {
                load = new Load(null, 100,1,new Date().toLocaleDateString(),[]);
            }
        });
    };

    this.addCar = function () {
        if (cars < 4) {
            cars = cars +1;
        }
        this.drawScreen();
    };
    this.removeCar = function () {
        if (cars > 1) {
            cars = cars - 1;
        }
        this.drawScreen();
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
    }
});
