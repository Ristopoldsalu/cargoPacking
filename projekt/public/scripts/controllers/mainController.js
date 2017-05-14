app.controller('myCtrl',function ($scope, $firebaseObject, CanvasService) {

    addEventListener('load', load, false);
    function load(){
        $("#defaultOpen").click();
    }

    $scope.openPage = function ($event, pageName) {
        // Declare all variables
        var i, tabcontent, tablinks;

        // Get all elements with class="tabcontent" and hide them
        tabcontent = document.getElementsByClassName("tabcontent");
        for (i = 0; i < tabcontent.length; i++) {
            console.log(tabcontent[i].length);

            tabcontent[i].style.display = "none";
        }

        // Get all elements with class="tablinks" and remove the class "active"
        tablinks = document.getElementsByClassName("tablinks");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        }

        // Show the current tab, and add an "active" class to the button that opened the tab
        document.getElementById(pageName).style.display = "block";
        $event.currentTarget.className += " active";
        CanvasService.drawScreen();

    };

    var rootRef = firebase.database().ref().child('packagetype');
    var ref = rootRef.child('object');
    var syncObject = $firebaseObject(ref);
    console.log(syncObject.name);
    syncObject.$bindTo($scope, "data");


});