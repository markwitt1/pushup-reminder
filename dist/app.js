"use strict";
exports.__esModule = true;
var electron_1 = require("electron");
var path = require("path");
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
    // eslint-disable-line global-require
    electron_1.app.quit();
}
var active = true;
var tray;
var contextMenu = electron_1.Menu.buildFromTemplate([
    { label: "pushup-reminder" },
    { type: "separator" },
    {
        id: 'checkbox',
        label: "activated",
        type: "checkbox",
        checked: true,
        click: function (menuItem) {
            active = menuItem.checked;
        }
    }
]);
var windows = [];
var createWindow = function () {
    tray = new electron_1.Tray(path.join(__dirname, "../icon/icon.ico"));
    tray.setToolTip("Pushup Reminder");
    tray.setContextMenu(contextMenu);
    var workerWindow = new electron_1.BrowserWindow({
        show: false,
        webPreferences: { nodeIntegration: true }
    });
    workerWindow.loadFile(path.join(__dirname, "../src/background/worker.html"));
    electron_1.ipcMain.on("close-all", function () {
        windows.forEach(function (window) {
            window.close();
        });
        windows = [];
    });
    electron_1.ipcMain.on("set-active", function (event, checked) {
        active = checked;
        contextMenu.getMenuItemById('checkbox').checked = active;
    });
    electron_1.ipcMain.on("open", function () {
        if (windows.length === 0 && active) {
            var allScreens = electron_1.screen.getAllDisplays();
            var primary_1 = electron_1.screen.getPrimaryDisplay();
            allScreens.forEach(function (screen) {
                if (screen.bounds.x === primary_1.bounds.x &&
                    screen.bounds.y === primary_1.bounds.y) {
                    // Create the browser window.
                    var mainWindow = new electron_1.BrowserWindow({
                        x: primary_1.bounds.x,
                        y: primary_1.bounds.y,
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
                }
                else {
                    var secondWindow = new electron_1.BrowserWindow({
                        x: screen.bounds.x,
                        y: screen.bounds.y
                    });
                    secondWindow.loadFile(path.join(__dirname, "..", "src", "second.html"));
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
electron_1.app.on("ready", createWindow);
// Quit when all windows are closed.
electron_1.app.on("window-all-closed", function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== "darwin") {
        electron_1.app.quit();
    }
});
electron_1.app.on("activate", function () {
    createWindow();
});
//# sourceMappingURL=app.js.map