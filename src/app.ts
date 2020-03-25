import { app, BrowserWindow, ipcMain, screen } from 'electron'
import * as path from 'path'

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit()
}

let windows: BrowserWindow[] = []
const createWindow = (): void => {
  const workerWindow = new BrowserWindow({
    show: false,
    webPreferences: { nodeIntegration: true }
  })

  workerWindow.loadFile(path.join(__dirname, '../src/background/worker.html'))

  ipcMain.on("close-all", () => {
    windows.forEach(window => {
      window.close()
    })
    windows = []
  })

  ipcMain.on('open', () => {
    if (windows.length === 0) {
      const allScreens = screen.getAllDisplays()
      const primary = screen.getPrimaryDisplay()

      allScreens.forEach(screen => {
        if (screen.bounds.x === primary.bounds.x && screen.bounds.y === primary.bounds.y) {
          // Create the browser window.
          const mainWindow = new BrowserWindow({
            x: primary.bounds.x,
            y: primary.bounds.y,
            webPreferences: {
              nodeIntegration: true
            }
          })

          mainWindow.removeMenu()

          mainWindow.loadFile(path.join(__dirname, '..', 'src', 'index.html'))

          mainWindow.setFullScreen(true)
          mainWindow.focus()

          windows.push(mainWindow)
        } else {
          const secondWindow = new BrowserWindow({
            x: screen.bounds.x,
            y: screen.bounds.y,
          })
          secondWindow.loadFile(path.join(__dirname, '..', 'src', 'second.html'))
          secondWindow.removeMenu()
          secondWindow.setFullScreen(true)

          secondWindow.focus()


          windows.push(secondWindow)
        }
      })

    }

  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
