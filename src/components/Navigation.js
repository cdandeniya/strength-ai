import React, { useState } from "react";
import { AppBar, Toolbar, Button, Box, IconButton, Typography, Drawer, List, ListItem, ListItemText, Divider } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import { NavLink, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import { useTheme } from '@mui/material/styles';

const navItems = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Profile", path: "/profile" },
  { label: "Workout Log", path: "/workout-log" },
  { label: "Workout History", path: "/workout-history" },
  { label: "Food Log", path: "/food-log" },
  { label: "Chat", path: "/chat" },
];

export default function Navigation({ toggleDarkMode, darkMode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/auth");
  };

  const handleLogoClick = () => {
    navigate('/dashboard');
  };

  const drawer = (
    <Box sx={{ width: 220 }} role="presentation" onClick={() => setDrawerOpen(false)}>
      <Typography
        variant="h6"
        sx={{ m: 2, display: "flex", alignItems: "center", cursor: 'pointer', color: theme.palette.primary.contrastText }}
        onClick={handleLogoClick}
      >
        <FitnessCenterIcon sx={{ mr: 1, color: theme.palette.primary.contrastText }} /> AI Gym Coach
      </Typography>
      <Divider />
      <List>
        {navItems.map(item => (
          <ListItem button key={item.path} component={NavLink} to={item.path}>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
        <ListItem button onClick={handleLogout}>
          <LogoutIcon sx={{ mr: 1 }} />
          <ListItemText primary="Logout" />
        </ListItem>
        <ListItem>
          <IconButton onClick={toggleDarkMode} color="inherit">
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
          <ListItemText primary={darkMode ? "Light Mode" : "Dark Mode"} />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <AppBar position="static" color="primary" elevation={2}>
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2, display: { xs: "flex", md: "none" } }} onClick={() => setDrawerOpen(true)}>
          <MenuIcon />
        </IconButton>
        <Box
          sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', mr: 2 }}
          onClick={handleLogoClick}
        >
          <FitnessCenterIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1, color: theme.palette.primary.contrastText }} />
          <Typography 
            variant="h6" 
            sx={{ display: { xs: "none", md: "flex" }, fontWeight: 700, color: theme.palette.primary.contrastText }}
          >
            AI Gym Coach
          </Typography>
        </Box>
        <Box sx={{ display: { xs: "none", md: "flex" }, flexGrow: 1 }}>
          {navItems.map(item => (
            <Button
              key={item.path}
              color="inherit"
              component={NavLink}
              to={item.path}
              style={({ isActive }) => ({
                fontWeight: isActive ? "bold" : "normal",
                textDecoration: isActive ? "underline" : "none",
                color: "inherit",
                marginRight: 8,
                transition: "all 0.2s"
              })}
            >
              {item.label}
            </Button>
          ))}
          <Button color="inherit" onClick={handleLogout} startIcon={<LogoutIcon />}>Logout</Button>
          <IconButton onClick={toggleDarkMode} color="inherit" sx={{ ml: 2 }}>
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Box>
      </Toolbar>
      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        {drawer}
      </Drawer>
    </AppBar>
  );
} 