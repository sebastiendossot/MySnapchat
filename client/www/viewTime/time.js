'use strict';

angular.module('myApp.viewTime', [])

.controller('timeCtrl', ['$scope', 'User', "userWebService", 
	function($scope, User, userWebService)  {

	    $scope.error = false
	    $scope.textTime = User.time.texte
	    $scope.imageTime = User.time.image
	    $scope.videoTime = User.time.video
	   
	    $scope.update = function() {
		User.time.texte = $scope.textTime
		User.time.image = $scope.imageTime
		User.time.video = $scope.videoTime
		var success = function(data) {
		    console.log("times updated")
		}
		var error = function(data) {
		    console.log("error : times not updated")
		}
		userWebService.putTimes({times: User.time}, success, error)
	    }
	    
	}])
