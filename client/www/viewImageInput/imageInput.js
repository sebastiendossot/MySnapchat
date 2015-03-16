'use strict';

angular.module('myApp.imageInput', ['ngRoute'])

.controller('imageCtrl', ['$scope', 'messageWebService', 'User',  '$location', '$routeParams', 'CameraService',
	function($scope, messageWebService, User, $location, $routeParams, CameraService)  {

		$scope.shotable = false;
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
				$scope.cameraAccessRefused = false;
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
			//$scope.preview = false;
			
			var pictureSource;   // picture source
			var destinationType; // sets the format of returned value

			// Wait for device API libraries to load
			//document.addEventListener("deviceready",onDeviceReady,false);

			// device APIs are available
			pictureSource=navigator.camera.PictureSourceType;
			destinationType=navigator.camera.DestinationType;
			capturePhotoEdit()
			//$("#PJ_mobile").show();

			// Called when a photo is successfully retrieved
			function onPhotoDataSuccess(imageData) {
				// Uncomment to view the base64-encoded image data
				// console.log(imageData);

				$scope.mobilePreview(true)
				
				var smallImage = document.getElementById('smallImage');
				smallImage.style.display = 'block';
				smallImage.src = "data:image/jpeg;base64," + imageData;
				//$scope.preview = true;
				
				$scope.dataUrl = imageData
				$scope.$apply();
			}

			function capturePhotoEdit() {
			// Take picture using device camera, allow edit, and retrieve image as base64-encoded string
			navigator.camera.getPicture(onPhotoDataSuccess, onFail, { allowEdit: true, destinationType: destinationType.DATA_URL });
		}

		function onFail(message) {
			alert('Failed because: ' + message);
		}
	}
	
	$scope.send = function(dataUrl) 
	{
		$scope.mobilePreview(false)
	
		console.log("SENDING : "+dataUrl)
		if(dataUrl) {
			var success = function() {
				//$scope.ress = "data:image/png;base64,"+data.img;
				window.location.reload()
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
