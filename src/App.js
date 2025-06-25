import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ThemeProvider, CssBaseline, createTheme, IconButton } from "@mui/material";
import AuthPage from "./pages/AuthPage";
import ProfilePage from "./pages/ProfilePage";
import DashboardPage from "./pages/DashboardPage";
import WorkoutLogPage from "./pages/WorkoutLogPage";
import WorkoutHistoryPage from "./pages/WorkoutHistoryPage";
import FoodLogPage from "./pages/FoodLogPage";
import ChatPage from "./pages/ChatPage";
import Navigation from "./components/Navigation";
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

function AppContent({ toggleDarkMode, darkMode }) {
  const location = useLocation();
  const hideNav = location.pathname === "/auth";
  return (
    <>
      {!hideNav && <Navigation toggleDarkMode={toggleDarkMode} darkMode={darkMode} />}
      <Routes>
        <Route path="/" element={<Navigate to="/auth" />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/workout-log" element={<WorkoutLogPage />} />
        <Route path="/workout-history" element={<WorkoutHistoryPage />} />
        <Route path="/food-log" element={<FoodLogPage />} />
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </>
  );
}

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      ...(darkMode
        ? {
            background: {
              default: "#181c24",
              paper: "#232936"
            },
            primary: { main: "#90caf9" },
            secondary: { main: "#f48fb1" },
            text: { primary: "#f5f5f5", secondary: "#b0b0b0" }
          }
        : {
            background: {
              default: "#f7fafd",
              paper: "#fff"
            },
            primary: { main: "#1a237e" },
            secondary: { main: "#8e24aa" },
            text: { primary: "#222", secondary: "#555" }
          })
    },
    typography: {
      fontFamily: "'Open Sans', Arial, Helvetica, sans-serif"
    }
  });
  const toggleDarkMode = () => setDarkMode(m => !m);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppContent toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
      </Router>
    </ThemeProvider>
  );
}
