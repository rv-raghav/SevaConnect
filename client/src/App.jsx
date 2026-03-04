import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AppRouter from "./routes";

function App() {
  useEffect(() => {
    if (typeof window.hideSplashScreen === "function") {
      window.hideSplashScreen();
    }
  }, []);

  return (
    <BrowserRouter>
      <AppRouter />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: { fontFamily: "Manrope, sans-serif", fontSize: "14px" },
          success: { iconTheme: { primary: "#10b981", secondary: "#fff" } },
          error: { iconTheme: { primary: "#ef4444", secondary: "#fff" } },
        }}
      />
    </BrowserRouter>
  );
}

export default App;
