import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AppRouter from "./routes";
import ThemeProvider from "./components/ui/ThemeProvider";
import useTheme from "./hooks/useTheme";

function AppContent() {
  const { isDark } = useTheme();

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
          style: {
            fontFamily: "Inter, sans-serif",
            fontSize: "14px",
            borderRadius: "12px",
            border: isDark ? "1px solid rgba(148,163,184,0.1)" : "1px solid #e2e8f0",
            background: isDark ? "rgba(30,41,59,0.9)" : "#ffffff",
            color: isDark ? "#f1f5f9" : "#0f172a",
            backdropFilter: "blur(12px)",
          },
          success: { iconTheme: { primary: "#10b981", secondary: "#fff" } },
          error: { iconTheme: { primary: "#ef4444", secondary: "#fff" } },
        }}
      />
    </BrowserRouter>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
