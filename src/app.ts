import {
  app,
  BrowserWindow,
  ipcMain,
  screen,
  Menu,
  MenuItem,
  Tray,
  IpcMainEvent
} from "electron";
import * as path from "path";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  // eslint-disable-line global-require
  app.quit();
}
let active = true;
let tray: Tray;
const contextMenu = Menu.buildFromTemplate([
  { label: "pushup-reminder" },
  { type: "separator" },
  {
    id : 'checkbox',
    label: "activated",
    type: "checkbox",
    checked: true,
    click: (menuItem: MenuItem): void => {
      active = menuItem.checked;
    }
  }
]);
let windows: BrowserWindow[] = [];
const createWindow = (): void => {
  tray = new Tray(path.join(__dirname, "../icon/icon.ico"));

  tray.setToolTip("Pushup Reminder");
  tray.setContextMenu(contextMenu);

  const workerWindow = new BrowserWindow({
    show: false,
    webPreferences: { nodeIntegration: true }
  });

  workerWindow.loadFile(path.join(__dirname, "../src/background/worker.html"));

  ipcMain.on("close-all", () => {
    windows.forEach(window => {
      window.close();
    });
    windows = [];
  });

  ipcMain.on("set-active", (event: IpcMainEvent, checked: boolean): void => {
    active = checked;
    contextMenu.getMenuItemById('checkbox').checked = active;
  });

  ipcMain.on("open", () => {
    if (windows.length === 0 && active) {
      const allScreens = screen.getAllDisplays();
      const primary = screen.getPrimaryDisplay();

      allScreens.forEach(screen => {
        if (
          screen.bounds.x === primary.bounds.x &&
          screen.bounds.y === primary.bounds.y
        ) {
          // Create the browser window.
          const mainWindow = new BrowserWindow({
            x: primary.bounds.x,
            y: primary.bounds.y,
            webPreferences: {
              nodeIntegration: true
            }
          });

          mainWindow.removeMenu();

          mainWindow.loadFile(path.join(__dirname, "..", "src", "index.html"));

          mainWindow.setFullScreen(true);
          mainWindow.focus();
          mainWindow.webContents.openDevTools();

          windows.push(mainWindow);
        } else {
          const secondWindow = new BrowserWindow({
            x: screen.bounds.x,
            y: screen.bounds.y
          });
          secondWindow.loadFile(
            path.join(__dirname, "..", "src", "second.html")
          );
          secondWindow.removeMenu();
          secondWindow.setFullScreen(true);

          secondWindow.focus();

          windows.push(secondWindow);
        }
      });
    }
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  createWindow();
});
