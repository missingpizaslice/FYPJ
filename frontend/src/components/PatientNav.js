import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import { Typography } from "@mui/material";
import { Button, Typography, Menu, MenuItem } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function PatientNav() {
  const isLoggedIn = !!localStorage.getItem("doctorData");
  const navigate = useNavigate();
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);

  const styles = {
    navbar: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1,
    },
  };

  const handleOpenMenu = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setMenuAnchorEl(null);
  };

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

  const handleChangePassword = () => {
    // Add your change password logic here
    // For example, navigate to the change password page
    navigate("/DoctorUpdatePassword");
    handleCloseMenu();
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" style={styles.navbar}>
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
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Pain Analysis
          </Typography>
          {isLoggedIn && (
            <div>
              <Button onClick={handleOpenMenu} color="inherit" sx={{}}>
                {JSON.parse(localStorage.getItem("doctorData")).doctor_name}
              </Button>
              <Menu
                anchorEl={menuAnchorEl}
                open={Boolean(menuAnchorEl)}
                onClose={handleCloseMenu}
              >
                <MenuItem
                  onClick={handleChangePassword}
                  sx={{
                    transition: "background-color 0.3s",
                    "&:hover": {
                      backgroundColor: "#e0e0e0",
                    },
                  }}
                >
                  Change Password
                </MenuItem>
                <MenuItem
                  onClick={handleLogout}
                  sx={{
                    transition: "background-color 0.3s, color 0.3s",
                    "&:hover": {
                      backgroundColor: "#e0e0e0",
                      color: "red",
                    },
                  }}
                >
                  Logout
                </MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
