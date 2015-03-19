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
		/*var mediaConstraints = { audio: !!navigator.mozGetUserMedia, video: true };
		document.querySelector('#start-recording').onclick = function() {
			this.disabled = true;
			navigator.getUserMedia(mediaConstraints, onMediaSuccess, onMediaError);
		};
		document.querySelector('#stop-recording').onclick = function() {
			this.disabled = true;
			mediaRecorder.stop();
		};

		var mediaRecorder;
		function onMediaSuccess(stream) {
			var video = document.createElement('video');

			video = mergeProps(video, {
				controls: true,
				width: 320,
				height: 240,
				src: URL.createObjectURL(stream)
			});

			video.play();

			videosContainer.appendChild(video);
			videosContainer.appendChild(document.createElement('hr'));
			mediaRecorder = new MediaStreamRecorder(stream);
			mediaRecorder.mimeType = 'video/webm'; // this line is mandatory
			mediaRecorder.videoWidth = 320;
			mediaRecorder.videoHeight = 240;

			mediaRecorder.ondataavailable = function(blob) {
				var a = document.createElement('a');
				a.target = '_blank';
				/*a.innerHTML = 'Open Recorded Video No. ' + (index++) + ' (Size: ' + bytesToSize(blob.size) + ') Time Length: ' + getTimeLength(3000);*/
				/*a.href = URL.createObjectURL(blob);
				a.innerHTML = a.href ;
				videosContainer.appendChild(a);
				videosContainer.appendChild(document.createElement('hr'));
			};

			mediaRecorder.start(5000);
			mediaRecorder.stop();
			document.querySelector('#stop-recording').disabled = false;
		}

		function onMediaError(e) {
			console.error('media error', e);
		}

		var videosContainer = document.getElementById('videos-container');
		var index = 1;
		function bytesToSize(bytes) {
			var k = 1000;
			var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
			if (bytes === 0) 
				return '0 Bytes';
			var i = parseInt(Math.floor(Math.log(bytes) / Math.log(k)),10);
			return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
		}
		function getTimeLength(milliseconds) {
			var data = new Date(milliseconds);
			return data.getUTCHours()+" hours, "+data.getUTCMinutes()+" minutes and "+data.getUTCSeconds()+" second(s)";
		}
		window.onbeforeunload = function() {
			document.querySelector('#start-recording').disabled = false;
		};
		/*var captureSuccess = function(mediaFiles) {
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
			alert("testVideo");
			

		}*/

	}
	])
