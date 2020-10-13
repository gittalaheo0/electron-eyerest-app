const { app, BrowserWindow, Menu, remote, Tray, ipcMain, dialog } = require('electron')
const path = require("path")

//declare the setimeout varriable
var saveOneTime = false
var openLongRestDialog, openAgainLongRestDialog, openNotification, openShortRestDialog, openAgainShortRestDialog;

const breakData = {
  longBreak:{
    active: true,
    notification: true,
    timeSettedBetweenRest: 0,
    timeSettedRest: 0,
    timeSettedNotification: 0,
  },
  shortBreak:{
    active: true,
    timeSettedBetweenRest: 0,
    timeSettedRest: 0,
  },
  enabeSound: true,
  enabeStrictMode: false,
  enabeCloseRightBtn: true,
  enabeCloseWhenPlayVideo: false,
  setAplication: function(enabeSound, enabeStrictMode, enabeCloseRightBtn, enabeCloseWhenPlayVideo, longBreak, notification, shortBreak){
    this.enabeSound = enabeSound;
    this.enabeStrictMode = enabeStrictMode;
    this.enabeCloseRightBtn = enabeCloseRightBtn;
    this.enabeCloseWhenPlayVideo = enabeCloseWhenPlayVideo;
    this.longBreak.active = longBreak;
    this.longBreak.notification = notification;
    this.shortBreak.active = shortBreak;
  },
  setLongbreakTime: function(betweenRest, rest, notification){
    this.longBreak.timeSettedBetweenRest = parseInt(betweenRest);
    this.longBreak.timeSettedRest = parseInt(rest);
    this.longBreak.timeSettedNotification = parseInt(notification);
  },
  setShortbreakTime: function(betweenRest, rest){
    this.shortBreak.timeSettedBetweenRest = parseInt(betweenRest);
    this.shortBreak.timeSettedRest = parseInt(rest);
    
  },
  activeLongBreak: function(now){
    if(this.longBreak.timeSettedRest!=0 &&this.longBreak.timeSettedBetweenRest!=0&&(this.longBreak.timeSettedNotification-this.longBreak.timeSettedBetweenRest<=0)){
      if(!now){
        openLongRestDialog = setTimeout(function() {
          //if lognbreak is actived
          if(this.longBreak.active){
            // open long rest dialog first time
            createBreakDialog("", this.longBreak.timeSettedRest);
            // open long rest dialog the rest time
            openAgainLongRestDialog = setTimeout(function(){ 
              //callback
              this.activeLongBreak(false) 
            }.bind(this), this.longBreak.timeSettedRest)            
          }
        }.bind(this), this.longBreak.timeSettedBetweenRest)

        openNotification = setTimeout(function() {
          //if lognbreak is actived
          if(this.longBreak.notification){
            // open notifycation first time
            createBreakDialog("notification", this.longBreak.timeSettedNotification, this.enabeSound);            
          }
        }.bind(this), this.longBreak.timeSettedBetweenRest-this.longBreak.timeSettedNotification)

      }else{
        // open long rest dialog
        createBreakDialog("", this.longBreak.timeSettedRest);
      }
    }else{
      dialog.showErrorBox('You set the wrong time', ""); 
    }
  },
  activeShortBreak: function(now){
    if(this.shortBreak.timeSettedRest!=0 &&this.shortBreak.timeSettedBetweenRest!=0){
      if(!now){
        openShortRestDialog = setTimeout(function() {
          // if shortbreak is actived
          if(this.shortBreak.active){
            // open long rest dialog
            createBreakDialog("", this.shortBreak.timeSettedRest);
            // reopen short break
            openAgainShortRestDialog = setTimeout(function(){ 
              this.activeShortBreak(false)            
            }.bind(this), this.shortBreak.timeSettedRest)
          }
        }.bind(this), this.shortBreak.timeSettedBetweenRest)
      }else{
        // open short rest dialog
        createBreakDialog("", this.shortBreak.timeSettedRest);
      }
    }else{
    }
  },
}
var win = null;
function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
    },
  })  
  win.setIcon(path.join(__dirname, '/assets/img/eye.png'));
  // and load the index.html of the app.
  win.loadFile('./src/index.html')
  // Open the DevTools.
  // win.webContents.openDevTools()
  // create menu
  var menu = Menu.buildFromTemplate([
     {
       label: 'Menu',
       submenu: [
           {
             label: 'Dev Tool',
             click(){
                 win.webContents.openDevTools()
             },
             accelerator: "f12"
           },
           {
             label: 'Reset',
             click(){
                app.quit();
                app.relaunch()
             },
             accelerator: "f5"
           },
           {type: 'separator'},
           {
             label: 'exit',
             click(){
               app.quit()
             },
             accelerator: "alt + f4"
           },
       ]
     },
  ])
  Menu.setApplicationMenu(menu)
}

function createBreakDialog(type, timeToClose, sound) {
  // Create the browser window.
  let breakWin = new BrowserWindow({
    x: type=="notification" ? 0 : '',
    y: type=="notification" ? 0 : '',
    width: 800,
    height: type=="notification" ? 200 : 600,
    resizable: false,
    fullscreen: type=="notification" ? false : true,
    focusable: false,
    webPreferences: {
      enableRemoteModule: true,
    },
    frame: false
  })  
  breakWin.setIcon(path.join(__dirname, '/assets/img/eye.png'));
  // and load the index.html of the app.
  if(sound){
    breakWin.loadFile(`./src/${type}-sound-break.html`);
  }else{
    breakWin.loadFile(`./src/${type}-break.html`);
  }
  // close when timeout
  setTimeout(()=>{
    breakWin.close();
  }, timeToClose);
}

let tray = null
function createTray(){
  tray = new Tray('./assets/img/eye.png')
  const contextMenu = Menu.buildFromTemplate([
    { 
    	label: 'Setting',
    	click: function () {
        	createWindow()
        },
   	},
    {type: 'separator'},
    { 
      label: 'Quit',
      click: function () {
           app.quit()
        },
     },
  ])
  tray.setToolTip('Eye rest')
  tray.setContextMenu(contextMenu)
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(()=>{
  createWindow(); // window open
  createTray()  // tray open
})

// handle open break dialog
ipcMain.on('open-break-dialog-now', (event, arg) => {

  if(arg[0]=="long"){
    breakData.setLongbreakTime(arg[1],arg[2] ,arg[3]);
    breakData.activeLongBreak(true);
  }
  if(arg[0]=="short"){
    breakData.setShortbreakTime(arg[1],arg[2]);
    breakData.activeShortBreak(true);
  }
})


ipcMain.on('open-break-dialog-countdown', (event, arg) => {
    // settime
    breakData.setLongbreakTime(arg[0],arg[1] ,arg[2]);
    breakData.setShortbreakTime(arg[3],arg[4]);
    breakData.setAplication(arg[5],arg[6],arg[7],arg[8],arg[9],arg[10],arg[11]);
    if(!saveOneTime){
      // app save once
      saveOneTime = true;
    }else{
      clearTimeout(openLongRestDialog);
      clearTimeout(openAgainLongRestDialog);
      clearTimeout(openNotification);
      clearTimeout(openShortRestDialog);
      clearTimeout(openAgainShortRestDialog);      
    }
    breakData.activeLongBreak(false);

    if(breakData.longBreak.timeSettedNotification-breakData.longBreak.timeSettedBetweenRest<0){
      breakData.activeShortBreak(false);      
      // close main window if set the wrong time
      win.close()
    }
})


// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    // app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.