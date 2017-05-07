app.controller('packingController',function ($scope, $firebaseObject, PackageTypeService,
LocationService, Package, LoadService, Load, PackageService) {

    var numShapes;
    var numShapesToMake;
    var shapes;
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
    var theCanvas;
    var context;
    var canvasWidth = 100;
    var canvasHeight = 100;
    var load;
    var id = 34;


    function canvasSupport() {
        return Modernizr.canvas;
    }


    //getPackTypes
    $scope.packageTypes = PackageTypeService.getPackageTypes();
    //getLocations
    $scope.locations = LocationService.getLocations();

    //initiate canvas
    $scope.onCanvasLoadTick = function() {
        if (('#canvasOne') !== null) {
            //stop timer:
            clearInterval($scope.loadTimer);
            canvasApp();
        }
    };
    $scope.loadTimer = setInterval($scope.onCanvasLoadTick(), 1000/15);


    $scope.load = {};

    //addOneShape
    $scope.addShape = function () {
        makeOneShape($scope.selectedpack, $scope.selectedLocation, $scope.load);
        drawScreen();
    };

    //saveLoad
    $scope.saveLoad = function () {
        if (LoadService.saveLoad(load, shapes)) {
            PackageService.savePackages(shapes);
            alert("Salvestatud");
        }
    };

    //ZOOMING
    var canvasOne = $('#canvasOne');
    $scope.zoomIn = function() {
        canvasWidth = canvasWidth + 10;
        canvasHeight = canvasHeight + 10;
        canvasOne.width(canvasWidth + '%');
        canvasOne.height(canvasHeight + '%');
    };
    $scope.zoomOut = function () {
        canvasWidth = canvasWidth - 10;
        canvasHeight = canvasHeight - 10;
        canvasOne.width(canvasWidth+'%');
        canvasOne.height(canvasHeight+'%');
    };

//For debug messages
    var Debugger = function() { };
    Debugger.log = function(message) {
        try {
            console.log(message);
        }
        catch (exception) {
        }
    };

    function makeOneShape(selectedPack, selectedLocation, load) {
        var i;
        var tempX;
        var tempY;
        var tempRad;
        var tempR;
        var tempG;
        var tempB;
        var tempA;
        var tempColor;

        tempRad = 50 + Math.floor(Math.random()*20);
        tempX = Math.random()*(theCanvas.width - tempRad);
        tempY = Math.random()*(theCanvas.height - tempRad);

        //we set a randomized color, including a random alpha (transparency) value.
        //The color is set using the rgba() method.
        tempR = Math.floor(Math.random()*255);
        tempG = Math.floor(Math.random()*255);
        tempB = Math.floor(Math.random()*255);
        tempA = 0.3;
        tempColor = "rgba(" + tempR + "," + tempG + "," + tempB + "," + tempA + ")";
        tempShape = new Package(id++, tempX, tempY, selectedPack, selectedLocation, load);
        tempShape.packageType.color = tempColor;
        tempShape.radius = tempRad;
        shapes.splice(0,0,tempShape);
        console.log('uus shape');
        numShapes++;
    }

    function drawShapes() {
        var i;
        for (i=0; i < shapes.length; i++) {
            shapes[i].drawToContext(context);
        }
    }
    function drawScreen() {
        //bg
        context.fillStyle = "#AED3FD";
        context.fillRect(0,0,theCanvas.width,theCanvas.height);
        context.fillStyle = "#000000";
        context.rect(100,100,700,500);
        context.stroke();

        drawShapes();
    }



    function canvasApp() {
        console.log('init');
        if (!canvasSupport()) {
            return;
        }

        theCanvas = document.getElementById("canvasOne");
        context = theCanvas.getContext("2d");

        init();

        function init() {
            numShapes = 0;
            console.log('teeb init');
            numShapesToMake = 10;
            easeAmount = 0.45;

            shapes = [];

            //makeShapes();

            drawScreen();
            load = new Load(100,1,"24.04.17",[]);
            theCanvas.addEventListener("mousedown", mouseDownListener, false);
        }



        function mouseDownListener(evt) {
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
                if (shapes[i].hitDeleteTest(mouseX, mouseY)) {
                    deleteIndex = i;
                    deleteShape = true;

                } else if (shapes[i].hitTest(mouseX, mouseY)) {
                    dragging = true;
                    //the following variable will be reset if this loop repeats with another successful hit:
                    dragIndex = i;
                }
            }
            if (dragging == true) {
                curDown = false;
                deleteShape = false;
            } else if (deleteShape) {
                curDown = false;
            }

            if (dragging) {
                window.addEventListener("mousemove", mouseMoveListener, false);

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
                timer = setInterval(onTimerTick, 1000/30);
            } else if (curDown){
                window.addEventListener("mousemove", mouseMoveListener, false);
            } else if (deleteShape) {
                shapes.splice(deleteIndex,1);
                numShapes--;
                drawScreen();
            }
            theCanvas.removeEventListener("mousedown", mouseDownListener, false);
            window.addEventListener("mouseup", mouseUpListener, false);

            //code below prevents the mouse down from having an effect on the main browser window:
            if (evt.preventDefault) {
                evt.preventDefault();
            } //standard
            else if (evt.returnValue) {
                evt.returnValue = false;
            } //older IE
            return false;
        }

        function onTimerTick() {
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
            drawScreen();
        }

        function mouseUpListener(evt) {
            theCanvas.addEventListener("mousedown", mouseDownListener, false);
            window.removeEventListener("mouseup", mouseUpListener, false);
            if (dragging) {
                dragging = false;
                window.removeEventListener("mousemove", mouseMoveListener, false);
            }
            if (curDown) {
                curDown = false;
                window.removeEventListener("mousemove", mouseMoveListener, false);
            }
        }

        function mouseMoveListener(evt) {

            if (dragging) {
                var posX;
                var posY;
                var shapeRad = shapes[shapes.length-1].radius;
                var minX = shapeRad;
                var maxX = theCanvas.width - shapeRad;
                var minY = shapeRad;
                var maxY = theCanvas.height - shapeRad;

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
        }
    }

});

