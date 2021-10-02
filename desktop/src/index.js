const { BrowserWindow, app } = require('electron')
require('/mnt/mydrive/Projects/TimeTracker/front-end/build/index.js')

let mainWindow = null

function main() {
    console.log(process.env)
    console.log(process.env.port)
    mainWindow = new BrowserWindow()
    mainWindow.loadURL(`http://localhost:3000/`)
    mainWindow.on('close', event => {
        mainWindow = null
    })
}

app.on('ready', main)