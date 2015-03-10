'use strict';

angular.module('myApp.imageInput', ['ngRoute'])

.controller('imageCtrl', ['$scope', 'messageWebService', 'User',  '$location',
	function($scope, messageWebService, User, $location)  {
	
	$("#PJ").hide();
	$("#PJ_mobile").hide();
	
	$scope.showNavPhotoView = function() 
	{
		var onFail = function(e) { 
			console.log('failed',e); 
		}

		window.URL = window.URL || window.webkitURL ;
		navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
		var video = document.querySelector('video');
		if(navigator.getUserMedia) {
			navigator.getUserMedia({video: true},function(stream) { video.src = window.URL.createObjectURL(stream); },onFail);
		}
		
		document.getElementById("takePhoto").onclick = function() 
		{ 
			var canvas = document.getElementById('canvas'); 
			var ctx = canvas.getContext('2d'); 
			ctx.drawImage(video,0,0,30,30);
			
			$("#photoView").hide();
			$("#chatView").show();
			$("#PJ").show();
		} 

		$("#chatView").hide();
		$("#photoView").show();
	}
	
	$scope.showMobilePhotoView = function() 
	{
		var pictureSource;   // picture source
		var destinationType; // sets the format of returned value

		// Wait for device API libraries to load
		document.addEventListener("deviceready",onDeviceReady,false);

		// device APIs are available
		function onDeviceReady() {
			pictureSource=navigator.camera.PictureSourceType;
			destinationType=navigator.camera.DestinationType;
			capturePhotoEdit()
			$("#PJ_mobile").show();
		}

		// Called when a photo is successfully retrieved
		function onPhotoDataSuccess(imageData) {
			// Uncomment to view the base64-encoded image data
			// console.log(imageData);

			var smallImage = document.getElementById('smallImage');
			smallImage.style.display = 'block';
			smallImage.src = "data:image/jpeg;base64," + imageData;
		}

		function capturePhotoEdit() {
			// Take picture using device camera, allow edit, and retrieve image as base64-encoded string
			navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 20, allowEdit: true, destinationType: destinationType.DATA_URL });
		}

		function onFail(message) {
			alert('Failed because: ' + message);
		}
	}
	
	$scope.send = function() 
	{
		alert("envoi image")
	}	
}])
