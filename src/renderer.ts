import { ipcRenderer } from "electron";
const finishBtn: HTMLButtonElement = document.getElementById(
  "finishbtn"
) as HTMLButtonElement;
setTimeout(() => {
  finishBtn.disabled = false;
}, 10000);

finishBtn.addEventListener("click", () => {
  ipcRenderer.send("close-all");
});

const onOffSwitch: HTMLInputElement = document.getElementById(
  "myonoffswitch"
) as HTMLInputElement;

onOffSwitch.addEventListener("change", (): void => {
  ipcRenderer.send("set-active", onOffSwitch.checked);
});
