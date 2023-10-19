import React from "react";
import { useNavigate } from "react-router-dom";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import { Button, Typography } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function PatientNav() {
  const isLoggedIn = !!localStorage.getItem("doctorData");
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user data from local storage or perform any necessary logout actions
    navigate("/doctorLogin");
    localStorage.removeItem("userData");
  };

  const handleHomeClick = () => {
    if (isLoggedIn) {
      if (
        JSON.parse(localStorage.getItem("doctorData"))["staffType"] == "admin"
      ) {
        navigate("/admindashboard");
      } else {
        navigate("/doctorDashboard");
      }
    } else {
      navigate("/");
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          {isLoggedIn ? (
            <Button onClick={handleHomeClick} color="inherit">
              <HomeIcon />
            </Button>
          ) : (
            <Button onClick={handleHomeClick} color="inherit">
              <ArrowBackIcon />
            </Button>
          )}
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1 }}
          >
            Pain Analysis
          </Typography>
          {isLoggedIn && (
            <Button onClick={handleLogout} color="inherit">
              Logout
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
