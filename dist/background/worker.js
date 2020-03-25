"use strict";
exports.__esModule = true;
var electron_1 = require("electron");
console.log("yolo");
var message2UI = function () {
    console.log("yolo");
    electron_1.ipcRenderer.send('message-from-worker');
};
message2UI();
setInterval(message2UI, 1200000); //20 minute
//# sourceMappingURL=worker.js.map