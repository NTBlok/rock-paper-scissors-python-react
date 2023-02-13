import React from "react";
import ReactDOM from "react-dom/client";
// import App from "./App";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  far,
  faHand,
  faHandScissors,
  faHandRock,
} from "@fortawesome/free-regular-svg-icons";

import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { App } from "./App";
import { BrowserRouter } from "react-router-dom";

library.add(far, faHand, faHandScissors, faHandRock);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  // <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
//  </React.StrictMode>
);
