import { ipcRenderer } from 'electron';
const message2UI = (): void => {
    console.log("yolo");
    ipcRenderer.send('open');
}
message2UI();
setInterval(message2UI, 1200000) //20 minute