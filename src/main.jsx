import React from "react";
import ReactDOM from "react-dom/client";
import { HelmetProvider } from "@dr.pogodin/react-helmet";
import Portfolio from "./Portfolio.jsx";
import "./styles/globals.css";
import "./styles/utilities.css";
import "./styles/animations.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HelmetProvider>
      <Portfolio />
    </HelmetProvider>
  </React.StrictMode>
);
