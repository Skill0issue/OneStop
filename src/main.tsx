import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

//context
import { CanvasProvider } from "./context/canvasContext";
import { ThemeProvider } from "./context/theme";
//Router
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <ThemeProvider>
      <CanvasProvider>
        <App />
      </CanvasProvider>
    </ThemeProvider>
  </BrowserRouter>
);
