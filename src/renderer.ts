import {ipcRenderer} from 'electron';
const finishBtn: HTMLButtonElement = document.getElementById("finishbtn") as HTMLButtonElement;
setTimeout(() => {
    finishBtn.disabled = false;
}, 10000);

finishBtn.addEventListener("click", () => {
    ipcRenderer.send("close-all")
})