import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'node:path'

import { openFile, openDirectory } from './main/dialog'
import { generateOutput, getColumnsFromCsvFiles } from './main/csv'

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │
process.env.DIST = path.join(__dirname, '../dist')
process.env.PUBLIC = app.isPackaged
  ? process.env.DIST
  : path.join(process.env.DIST, '../public')

let win: BrowserWindow | null
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

function createWindow() {
  win = new BrowserWindow({
    width: 1000,
    height: 800,
    icon: path.join(process.env.PUBLIC, 'electron-vite.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  ipcMain.handle('dialog:openDirectory', openDirectory)
  ipcMain.handle('dialog:openFile', openFile)
  ipcMain.handle('csv:getColumnsFromFiles', getColumnsFromCsvFiles)
  ipcMain.handle('csv:generateOutput', generateOutput)

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    win.loadFile(path.join(process.env.DIST, 'index.html'))
  }
}

app.on('window-all-closed', () => {
  win = null
  app.quit()
})

app.whenReady().then(createWindow)
