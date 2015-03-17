'use strict';

angular.module('myApp.videoInput', ['ngRoute'])

.controller('videoCtrl', ['$scope', 'messageWebService', 'User',  '$location', '$routeParams', 'CameraService',
	function($scope, messageWebService, User, $location, $routeParams, CameraService)  {

		$scope.showNavVideoView = function() {
			alert("capture video navigateur");
		}
		
		var captureSuccess = function(mediaFiles) {
			var i, path, len;
			for (i = 0, len = mediaFiles.length; i < len; i += 1) {
				path = mediaFiles[i].fullPath;
				// do something interesting with the file
				// voir "Full Example" sur http://docs.phonegap.com/en/edge/cordova_media_capture_capture.md.html pour l'upload sur serveur
			}
		};

		var captureError = function(error) {
			navigator.notification.alert('Error code: ' + error.code, null, 'Capture Error');
		};
		
		$scope.showMobileVideoView = function() {
			navigator.device.capture.captureVideo(captureSuccess, captureError, {limit:1});
		}
	}
])
