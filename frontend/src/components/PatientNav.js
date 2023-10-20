import React from "react";
import { useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import { Typography } from "@mui/material";

export default function PatientNav() {
  const isLoggedIn = !!localStorage.getItem("doctorData");
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user data from local storage or perform any necessary logout actions
    navigate("/doctorLogin");
    localStorage.removeItem("userData");
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ background: "#2668c3" }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Pain Analysis
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
