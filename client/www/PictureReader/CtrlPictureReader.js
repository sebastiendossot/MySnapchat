'use strict';

angular.module('myApp.viewPictureReader', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/viewPictureReader', {
    templateUrl: 'PictureReader/viewPictureReader.html',
    controller: 'viewPictureReader2Ctrl'
});
}]).controller('viewPictureReader2Ctrl',['$scope', 'userWebService', function($scope, userWebService) {}])
