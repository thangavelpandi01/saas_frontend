import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import App from "./routes/AppRouter.jsx";
import { Provider, useSelector } from "react-redux";
import { store } from "./App/store.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";

function AppWrapper() {
  const mode = useSelector((state) => state.theme.mode);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", mode === "dark");
  }, [mode]);

  return (
    <>
      <App />

      {/* ✅ GLOBAL TOASTER */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme={mode} // 🔥 auto dark/light sync
      />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <AppWrapper />
    </Provider>
  </React.StrictMode>
);