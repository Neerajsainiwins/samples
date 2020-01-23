import React from "react";
import ReactDOM from "react-dom";
import Routes from "./Routes";
import registerServiceWorker from "./registerServiceWorker";

import "jquery";
import "popper.js";
import "bootstrap/dist/js/bootstrap";

import "./assets/plugins/bootstrap/css/bootstrap.css";
import "./assets/plugins/node-waves/waves.css";
import "./assets/plugins/animate-css/animate.css";
import "./assets/plugins/morrisjs/morris.css";
import "./assets/css/style.css";

import "./assets/css/themes/all-themes.css";

ReactDOM.render(<Routes />, document.getElementById("root"));
registerServiceWorker();
