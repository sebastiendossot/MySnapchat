'use strict';

angular.module('myApp.videoInput', ['ngRoute', 'angularFileUpload'])

.controller('videoCtrl', ['$scope', 'msgVideoWebService', 'User',  '$location', '$routeParams', 'CameraService', "$upload",
  function($scope, msgVideoWebService , User, $location, $routeParams, CameraService, $upload)  {
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
          canvas.width = w;
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
          $scope.webmBlob = Whammy.fromImageArray($scope.frames, 1000 / 60);

          var video = document.querySelector('#result');
          video.src = window.URL.createObjectURL($scope.webmBlob);
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
        $scope.send(mediaFiles[0])
      }

      function captureError(error) {
        console.error( 'An error occurred during capture: ' + error.code);
      }

      navigator.device.capture.captureVideo(captureSuccess, captureError, {limit: 1, duration: 6});

    }
    $scope.send = function(blob) { 
      $scope.mobilePreview(false)
      if(blob) {
        var fields = {
          type: "video",
          destinataires: [ {idDestinataire: $routeParams.idReceiver, lu: false} ],
          donnes: blob.type.split("/")[1], 
          temps: User.time.video,
          idEnvoyeur: User.id
        }
        var progress = function (evt) {
          var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
          console.log('progress: ' + progressPercentage + '% ' +
            evt.config.file.name);
        }
        var success = function (data, status, headers, config) {
          $scope.getMessages();
          $scope.webcamOn = false;
          $scope.shotable = false;
          $scope.hideStream = false;
        };
        var error = function(err) {
          console.error("Erreur lors de l'upload de la vidéo : "+err)
        }
        msgVideoWebService.post({fields:fields, file: blob},
          success, error, progress);
      }
    }
  }])
