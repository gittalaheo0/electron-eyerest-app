const { ipcRenderer } = require('electron')

var longTimeSettedBetweenRest = document.getElementById("longTimeSettedBetweenRest");
var longTimeSettedRest = document.getElementById("longTimeSettedRest");
var longTimeSettedNotification = document.getElementById("longTimeSettedNotification");
var shorTimeSettedBetweenRest = document.getElementById("shorTimeSettedBetweenRest");
var shorTimeSettedRest = document.getElementById("shorTimeSettedRest");
var enableSound = document.getElementById("enable_sound");
var enableStrictMode = document.getElementById("enable_strict_mode");
var enableCloseMode = document.getElementById("enable_close_mode");
var enableCloseWhenPlayVideo = document.getElementById("enable_close_when_play_video");
var enable_long_break = document.getElementById("enable_long_break");
var enable_notification = document.getElementById("enable_notification");
var enable_short_break = document.getElementById("enable_short_break");


// setting variable when app start
let time = localStorage.getItem('time');
if(time){
	let timeToString = JSON.parse(time);
	longTimeSettedBetweenRest.value = timeToString[0];
	longTimeSettedRest.value = timeToString[1];
	longTimeSettedNotification.value = timeToString[2];
	shorTimeSettedBetweenRest.value = timeToString[3];
	shorTimeSettedRest.value = timeToString[4];
	enableSound.checked = timeToString[5];
    enableStrictMode.checked = timeToString[6];
    enableCloseMode.checked = timeToString[7];
    enableCloseWhenPlayVideo.checked = timeToString[8];
    enable_long_break.checked = timeToString[9];
    enable_notification.checked = timeToString[10];
    enable_short_break.checked = timeToString[11];
}else{
	saveLocal();
}


function saveLocal(){
	let timeJson = JSON.stringify([longTimeSettedBetweenRest.value, longTimeSettedRest.value, longTimeSettedNotification.value, shorTimeSettedBetweenRest.value, shorTimeSettedRest.value, enableSound.checked, enableStrictMode.checked, enableCloseMode.checked, enableCloseWhenPlayVideo.checked, enable_long_break.checked, enable_notification.checked, enable_short_break.checked])
	localStorage.setItem('time', timeJson);	
}

// auto run when app start
function saveAndRun(){
	ipcRenderer.send('open-break-dialog-countdown', [longTimeSettedBetweenRest.value, longTimeSettedRest.value, longTimeSettedNotification.value, shorTimeSettedBetweenRest.value, shorTimeSettedRest.value, enableSound.checked, enableStrictMode.checked, enableCloseMode.checked, enableCloseWhenPlayVideo.checked, enable_long_break.checked, enable_notification.checked, enable_short_break.checked]);
}

// save and run app
var saveBtn = document.querySelector(".save");
saveBtn.addEventListener("click", function() {
	 saveLocal();
	 saveAndRun();
})


// run demo
var longBtn = document.querySelector("#active_long");
var shortBtn = document.querySelector("#active_short");
longBtn.onclick = function() {
	let longTimeSettedBetweenRest = parseInt(document.getElementById("longTimeSettedBetweenRest").value);
	let longTimeSettedRest = parseInt(document.getElementById("longTimeSettedRest").value);
	let longTimeSettedNotification = parseInt(document.getElementById("longTimeSettedNotification").value);
	saveLocal();
	// send message open break
	ipcRenderer.send('open-break-dialog-now', ["long", longTimeSettedBetweenRest, longTimeSettedRest, longTimeSettedNotification, enableSound.checked, enableStrictMode.checked, enableCloseMode.checked, enableCloseWhenPlayVideo.checked]);
}
shortBtn.onclick = function() {
	let shorTimeSettedBetweenRest = parseInt(document.getElementById("shorTimeSettedBetweenRest").value);
	let shorTimeSettedRest = parseInt(document.getElementById("shorTimeSettedRest").value);
	saveLocal();
	// send message open break
	ipcRenderer.send('open-break-dialog-now', ["short", shorTimeSettedBetweenRest, shorTimeSettedRest, enableSound.checked, enableStrictMode.checked, enableCloseMode.checked, enableCloseWhenPlayVideo.checked]);
}
