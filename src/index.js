import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import Config from "./components/config";
import ForceSimulationWithCirclePack from "./components/ForceSimulationWithCirclePack";
import ClassLayoutGraph from "./components/ClassLayoutGraph";

ReactDOM.render(
  <React.StrictMode>
    {/* <App /> */}
    {/* <Config /> */}
    <ForceSimulationWithCirclePack />
    <ClassLayoutGraph />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
