import { ipcRenderer } from 'electron';
console.log("yolo");
const message2UI = (): void => {
    console.log("yolo");
    ipcRenderer.send('message-from-worker');
}
message2UI();
setInterval(message2UI, 1200000) //20 minute