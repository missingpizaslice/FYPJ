import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import { Button, Typography, Menu, MenuItem } from "@mui/material";

export default function PatientNav() {
  const isLoggedIn = !!localStorage.getItem("doctorData");
  const navigate = useNavigate();
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);

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

  const handleChangePassword = () => {
    // Add your change password logic here
    // For example, navigate to the change password page
    navigate("/DoctorUpdatePassword");
    handleCloseMenu();
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
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
