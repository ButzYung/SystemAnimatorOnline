/*
on Electron v1.6.x has some scope issues/bugs which makes the global variables on this script inaccessible inside functions.
As a workaround, use anonymous self-invoking function to create its own scope.
*/

//(function () {

// Module to control application life.
const app = electron.app

// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow


// Quit when all windows are closed.
/*
app.on("window-all-closed", function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform != "darwin") {
    app.quit();
  }
});
*/

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on("ready", function() {

  mainWindow = new BrowserWindow({icon:__dirname + "\\icon_teto.ico", width:width, height:height, resizable:false, frame:false, transparent:global.is_transparent, show:false});

});

//})();