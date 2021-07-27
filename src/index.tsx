import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import stores from "./redux/store";
import {Toaster} from 'react-hot-toast'

ReactDOM.render(
  <>
    <Toaster position='top-right'/>
    <Provider store={stores}>
        <App />
    </Provider>
  </>,
  document.getElementById("root")
);
