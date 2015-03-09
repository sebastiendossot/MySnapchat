'use strict';

angular.module('myApp.imageInput', ['ngRoute'])

.controller('imageCtrl', ['$scope', 'messageWebService', 'User',  '$location',
	function($scope, messageWebService, User, $location)  {
	
	$("#PJ").hide();
	
	$scope.showPhotoView = function() 
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
	
	$scope.send = function() 
	{
		alert("envoi image")
	}	
}])
