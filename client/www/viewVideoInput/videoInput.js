'use strict';

angular.module('myApp.videoInput', ['ngRoute'])

.controller('videoCtrl', ['$scope', 'messageWebService', 'User',  '$location', '$routeParams', 'CameraService',
	function($scope, messageWebService, User, $location, $routeParams, CameraService)  {

		$scope.showNavVideoView = function() {	
			$scope.hasUserMedia = CameraService.hasUserMedia;
			$scope.hideStream = false;
			if(!$scope.hasUserMedia) {
				alert("Impossible to get access to you camera. Your browser may not be compatible")
				return;
			}
			$scope.webcamOn = true;
			$scope.onSuccess = function() {
				$scope.shotable = true;
				$scope.$apply();
			}
			$scope.onError = function(err) {
				if(err.name == "PermissionDeniedError") {
					$scope.cameraAccessRefused = true;
					$scope.$apply();
				}
			}
			$scope.onStream = function(stream) {

				$scope.record = function() {
					$scope.videoTime = 0;
					$scope.onRecord = true;
					var videoElement = document.querySelector('video'),
					canvas  = document.querySelector('canvas'),
					w = videoElement.offsetWidth,
					h = videoElement.offsetHeight,
					startTime = Date.now();
					canvas.width = w; // update the canvas width and height
					canvas.height = h;
					var ctx = canvas.getContext('2d');
					$scope.rafId;
					$scope.frames = [];
					var drawVideoFrame = function(time) {
						$scope.videoTime = Math.round((Date.now() - startTime) / 1000) + 's';
						if($scope.videoTime === '10s') $scope.stopRecord();
						$scope.rafId = requestAnimationFrame(drawVideoFrame);
						$scope.$apply();
						ctx.drawImage(videoElement, 0, 0, w, h);
						$scope.frames.push(canvas.toDataURL('image/webp', 1));
					};

					$scope.rafId = requestAnimationFrame(drawVideoFrame); // Note: not using vendor prefixes!
				}

				$scope.stopRecord = function() {
					$scope.onRecord = false;
					$scope.hideStream = true;
 					cancelAnimationFrame($scope.rafId);  // Note: not using vendor prefixes!

  					// 2nd param: framerate for the video file.
  					var webmBlob = Whammy.fromImageArray($scope.frames, 1000 / 60);

  					var video = document.querySelector('#result');
  					video.src = window.URL.createObjectURL(webmBlob);
  					$scope.dataUrl = video.src;
  				}
  			}
  		}
  		$scope.showMobileVideoView = function() {

  			function captureSuccess(mediaFiles) {
  				console.log(mediaFiles[0])
  				/*var video = document.querySelector('#result');
  				video.src = mediaFiles[0].fullPath;
  				$scope.hideStream = true;
  				$scope.$apply();*/
  				$scope.send(mediaFiles)
  			}

  			function captureError(error) {
  				console.error( 'An error occurred during capture: ' + error.code);
  			}

  			navigator.device.capture.captureVideo(captureSuccess, captureError, {limit: 1, duration: 6});

  		}
  		$scope.send = function(dataUrl) 
  		{
  			$scope.mobilePreview(false)

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
					type: "video", 
					donnes: dataUrl, 
					temps: User.time.video,
					idEnvoyeur: User.id,
					destinataires: [ {idDestinataire: $routeParams.idReceiver, lu: false} ]
				}
				, success, error)
			}
		}			

	}
	])
