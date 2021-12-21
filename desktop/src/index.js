const {app, BrowserWindow} = require("electron");
const path = require('path');
require('/mnt/mydrive/Projects/TimeTracker/front-end/build/index.js')
let mainWindow

function main() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        autoHideMenuBar: true,
        webPreferences: {
            enableRemoteModule: true,
            preload: path.join(__dirname, '../src/preload.js'),
            nodeIntegration: true
        }
    });

    mainWindow.loadURL(`http://localhost:3000/`);

    mainWindow.on('close', event => {
        mainWindow = null
    });
}

app.on('ready', main)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) createWindow()
})
