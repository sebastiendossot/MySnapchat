'use strict';

angular.module('myApp.videoInput', ['ngRoute'])

.controller('videoCtrl', ['$scope', 'messageWebService', 'User',  '$location', '$routeParams', 'CameraService',
	function($scope, messageWebService, User, $location, $routeParams, CameraService)  {

		var mediaConstraints = { audio: !!navigator.mozGetUserMedia, video: true };
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
				a.href = URL.createObjectURL(blob);
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
