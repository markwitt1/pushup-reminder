"use strict";
exports.__esModule = true;
var electron_1 = require("electron");
var finishBtn = document.getElementById("finishbtn");
setTimeout(function () {
    finishBtn.disabled = false;
}, 10000);
finishBtn.addEventListener("click", function () {
    electron_1.ipcRenderer.send("close-all");
});
var onOffSwitch = document.getElementById("myonoffswitch");
onOffSwitch.addEventListener("change", function () {
    electron_1.ipcRenderer.send("set-active", onOffSwitch.checked);
});
//# sourceMappingURL=renderer.js.map