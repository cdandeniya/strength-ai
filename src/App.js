import React, { useState, useEffect } from "react";
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
import { AnimatePresence, motion } from "framer-motion";

function AnimatedRoutes({ toggleDarkMode, darkMode }) {
  const location = useLocation();
  const hideNav = location.pathname === "/auth";
  return (
    <>
      {!hideNav && <Navigation toggleDarkMode={toggleDarkMode} darkMode={darkMode} />}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Navigate to="/auth" />} />
          <Route path="/auth" element={
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.5 }}>
              <AuthPage />
            </motion.div>
          } />
          <Route path="/profile" element={
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.5 }}>
              <ProfilePage />
            </motion.div>
          } />
          <Route path="/dashboard" element={
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.5 }}>
              <DashboardPage />
            </motion.div>
          } />
          <Route path="/workout-log" element={
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.5 }}>
              <WorkoutLogPage />
            </motion.div>
          } />
          <Route path="/workout-history" element={
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.5 }}>
              <WorkoutHistoryPage />
            </motion.div>
          } />
          <Route path="/food-log" element={
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.5 }}>
              <FoodLogPage />
            </motion.div>
          } />
          <Route path="/chat" element={
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.5 }}>
              <ChatPage />
            </motion.div>
          } />
        </Routes>
      </AnimatePresence>
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

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
      document.documentElement.classList.add('dark-mode');
      const root = document.getElementById('root');
      if (root) root.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
      document.documentElement.classList.remove('dark-mode');
      const root = document.getElementById('root');
      if (root) root.classList.remove('dark-mode');
    }
  }, [darkMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AnimatedRoutes toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
      </Router>
    </ThemeProvider>
  );
}
