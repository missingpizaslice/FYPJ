import React, { useState } from "react";
import PatientNav from "../components/PatientNav";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { FormControl, TextField, Typography } from "@mui/material";
import { Container } from "@mui/system";

const inital = {
  email: "",
  password: "",
};

export default function DoctorLogin() {
  const [state, setstate] = useState(inital);
  const { email, password } = state;

  const handleChange = (e) => {
    let { name, value } = e.target;
    setstate({ ...state, [name]: value });
  };

  const handlesubmit = (e) => {
    e.preventDefault();
    console.log(state);
  };

  return (
    <>
      <PatientNav />

      <Container style={{ marginTop: "50px" }}>
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            component="form"
            onSubmit={handlesubmit}
            noValidate
            sx={{
              maxWidth: "400px",
              marginBottom: "70px",
              boxShadow: 2,
              padding: "50px",
              borderRadius: "5px",
            }}
          >
            <Typography component="h1" variant="h4" sx={{ padding: "20px" }}>
              Login
            </Typography>
            <FormControl fullWidth="true" margin="normal">
              <Typography component="p" align="left">
                Email
              </Typography>
              <TextField
                required
                fullWidth
                type="text"
                placeholder="john@example.com"
                name="email"
                value={email || ""}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl fullWidth="true" margin="normal">
              <Typography component="p" align="left">
                password
              </Typography>
              <TextField
                required
                fullWidth
                type="password"
                placeholder="************"
                name="password"
                value={password || ""}
                onChange={handleChange}
              />
            </FormControl>
            <div className=".d-grid gap-2 mt-2">
              <Button
                type="submit"
                variant="contained"
                fullWidth="true"
                sx={{ marginTop: "20px" }}
              >
                Log in
              </Button>
            </div>
          </Box>
        </Box>
      </Container>
    </>
  );
}
