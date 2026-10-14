import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { App } from "./App";
import { MarqadorApp } from "./components/marqui/marqador-app";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {new URLSearchParams(location.search).get("app") === "marqador" ? <MarqadorApp /> : <App />}
  </StrictMode>,
);
