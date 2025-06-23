import React from "react";
import { AppBar, Toolbar, Button, Box } from "@mui/material";
import { NavLink } from "react-router-dom";

const navItems = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Profile", path: "/profile" },
  { label: "Workout Log", path: "/workout-log" },
  { label: "Workout History", path: "/workout-history" },
  { label: "Food Log", path: "/food-log" },
  { label: "Chat", path: "/chat" },
];

export default function Navigation() {
  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Box sx={{ flexGrow: 1 }}>
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
                marginRight: 8
              })}
            >
              {item.label}
            </Button>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
} 