import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ThemeProvider, CssBaseline, createTheme } from "@mui/material";
import AuthPage from "./pages/AuthPage";
import ProfilePage from "./pages/ProfilePage";
import DashboardPage from "./pages/DashboardPage";
import WorkoutLogPage from "./pages/WorkoutLogPage";
import WorkoutHistoryPage from "./pages/WorkoutHistoryPage";
import FoodLogPage from "./pages/FoodLogPage";
import ChatPage from "./pages/ChatPage";
import Navigation from "./components/Navigation";

const theme = createTheme();

function AppContent() {
  const location = useLocation();
  const hideNav = location.pathname === "/auth";
  return (
    <>
      {!hideNav && <Navigation />}
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

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;
