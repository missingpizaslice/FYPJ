import React, { useState, useEffect } from "react";
import PatientNav from "../components/PatientNav";
import { useDispatch, useSelector } from "react-redux";
import { loadsingleDoctor } from "../redux/action";
import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { FormControl, TextField, Typography } from "@mui/material";
import { Container } from "@mui/system";

const inital = {
  email: "",
  password: "",
};

export default function DoctorLogin() {
  const [localState, setLocalState] = useState(inital);

  const [loginerror, setloginerror] = useState("");
  const { email, password } = localState;
  const dispatch = useDispatch();
  const doctor = useSelector((state) => state.data.doctor);
  const navigate = useNavigate();

  useEffect(() => {
    if (document.cookie) {
      let cookie = document.cookie;
      var doctor_data = JSON.parse(cookie);
      if (doctor_data != null) {
        navigate("/doctorDashboard");
      }
    }
  }, []);

  useEffect(() => {
    setloginerror("");
    if (doctor.msg != null) {
      setloginerror(doctor.msg);
      setLocalState(inital);
      return;
    }

    if (doctor.id != null) {
      const doctorEmailfromDB = doctor.email;
      const doctorPasswordfromDB = doctor.password;
      authenticate(doctorEmailfromDB, doctorPasswordfromDB);
    }
  }, [doctor]);

  const handleChange = (e) => {
    let { name, value } = e.target;
    setLocalState({ ...localState, [name]: value });
  };

  const handlesubmit = (e) => {
    e.preventDefault();
    setloginerror("");
    dispatch(loadsingleDoctor(email));
  };

  const authenticate = (doctorEmailfromDB, doctorPasswordfromDB) => {
    if (password != doctorPasswordfromDB) {
      setloginerror("Login failed please try again");
      setLocalState(inital);
      return;
    } else {
      setLocalState(inital);
      setloginerror("");
      document.cookie = JSON.stringify(doctor);
      navigate("/doctorDashboard");
    }
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
            <Typography component="p">{loginerror}</Typography>
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
