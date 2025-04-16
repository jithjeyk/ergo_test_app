import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
// import Sidebar from "./Sidebar";
import { Provider } from "react-redux";
import { store } from "./store/store"; // Adjust path
import App from "./App";
import "./types/i18n";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* <Sidebar /> */}
    <Provider store={store}>
      <Suspense fallback="Loading...">
        <App />
      </Suspense>
    </Provider>
  </StrictMode>
);
