app.controller('historyController',function ($scope, LoadService) {

    $scope.loads = LoadService.getLoads();

});
