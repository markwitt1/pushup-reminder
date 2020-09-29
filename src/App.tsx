import React, { useState, useEffect } from "react";
import "./App.scss";
import { IpcRendererEvent } from "electron";
import useSettings from "./hooks/useSettings";
const { ipcRenderer } = window.require("electron");

const App = () => {
  const [pushupsNumber, setPushupsNumber] = useState<number | undefined>();
  const [waiting, setWaiting] = useState(true);
  const mySettings = useSettings();

  useEffect(() => {
    setPushupsNumber(mySettings?.pushupsNumber);

    let timeout = setTimeout(() => setWaiting(false), pushupsNumber);
    return () => {
      clearTimeout(timeout);
    };
  }, [mySettings, pushupsNumber]);
  return (
    <div className="App">
      <h1>
        Do <span>{pushupsNumber}</span> Pushups now
      </h1>
      <button
        id="finish-btn"
        disabled={waiting}
        onClick={() => ipcRenderer.send("closePopup")}
      >
        Finish
      </button>
    </div>
  );
};

export default App;
