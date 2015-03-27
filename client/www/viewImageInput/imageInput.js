'use strict';

angular.module('myApp.imageInput', ['ngRoute'])

.controller('imageCtrl', ['$scope', 'messageWebService', 'User',  '$location', '$routeParams', 'CameraService',
	function($scope, messageWebService, User, $location, $routeParams, CameraService)  {

		$scope.showNavPhotoView = function() {	
			$scope.hasUserMedia = CameraService.hasUserMedia;
			$scope.hideStream = false;
			if(!$scope.hasUserMedia) {
				alert("Impossible to get access to you camera. Your browser may not be compatible")
				return;
			}
			$scope.webcamOn = true;
			$scope.onSuccess= function() {
				$scope.shotable = true;
				$scope.$apply();
			}
			$scope.onError = function(err) {
				if(err.name == "PermissionDeniedError") {
					$scope.cameraAccessRefused = true;
					$scope.$apply();
				}
			}

			$scope.takeSnapshot = function() {
				if($scope.shotable) {
					var canvas  = document.querySelector('canvas'),
					ctx     = canvas.getContext('2d'),
					videoElement = document.querySelector('video'),
					w = videoElement.offsetWidth,
					h = videoElement.offsetHeight;

					canvas.width = w; // update the canvas width and height
					canvas.height = h;
					ctx.drawImage(videoElement, 0, 0, w, h);
					$scope.hideStream = true;

					$scope.dataUrl = canvas.toDataURL();
					console.log($scope.dataUrl);
				}
			}
		}

		$scope.showMobilePhotoView = function() {
			var pictureSource = navigator.camera.PictureSourceType;
			var destinationType = navigator.camera.DestinationType;
			capturePhotoEdit()

			// Called when a photo is successfully retrieved
			function onPhotoDataSuccess(imageData) {
				$scope.send("data:image/png;base64," + imageData)
			}
			function capturePhotoEdit() {
			// Take picture using device camera, allow edit, and retrieve image as base64-encoded string
			navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 10, encodingType: 1, allowEdit: true, destinationType: destinationType.DATA_URL });
		}

		function onFail(message) {
			console.error('Camera getPicture error : ' + message);
		}
	}
	
	$scope.send = function(dataUrl) 
	{
		$scope.mobilePreview(false)

		if(dataUrl) {
			var success = function() {
				$scope.getMessages();
				$scope.webcamOn = false;
				$scope.shotable = false;
				$scope.hideStream = false;
			}
			var error = function(data) {
				console.error("SUCCESS : " +data)
			}
			messageWebService.newMessage(
			{
				type: "image", 
				donnes: dataUrl, 
				temps: User.time.image,
				idEnvoyeur: User.id,
				destinataires: [ {idDestinataire: $routeParams.idReceiver, lu: false} ]
			}
			, success, error)
		}
	}	
}])
