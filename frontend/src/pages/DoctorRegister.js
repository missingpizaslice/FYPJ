import React, {useState} from "react";
import PatientNav from "../components/PatientNav";
import { useDispatch, useSelector } from "react-redux";
import {addDoctor} from "../redux/action";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { FormControl, TextField, Typography } from "@mui/material";
import { Container } from "@mui/system";

const inital = {
  email: "",
  name: "",
  staffNumber: "",
  password: "",
  confirmPassword: "",
};

export default function DoctorRegister() {
  const [state, setstate] = useState(inital);
  const { email, name, staffNumber, password, confirmPassword } = state;
  const dispatch = useDispatch();

  const handleChange = (e) => {
    let { name, value } = e.target;
    setstate({ ...state, [name]: value });
  };

  const handlesubmit = (e) => {
    e.preventDefault();
    dispatch(addDoctor(state));
    setstate(inital);
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
              Register
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
                Name
              </Typography>
              <TextField
                required
                fullWidth
                type="text"
                placeholder="John Doe"
                name="name"
                value={name || ""}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl fullWidth="true" margin="normal">
              <Typography component="p" align="left">
                Staff ID
              </Typography>
              <TextField
                required
                fullWidth
                type="text"
                placeholder="SN12345"
                name="staffNumber"
                value={staffNumber || ""}
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
            <FormControl fullWidth="true" margin="normal">
              <Typography component="p" align="left">
                confirm password
              </Typography>
              <TextField
                required
                fullWidth
                type="password"
                placeholder="************"
                name="confirmPassword"
                value={confirmPassword || ""}
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
                Register
              </Button>
            </div>
          </Box>
        </Box>
      </Container>
    </>
  );
}
