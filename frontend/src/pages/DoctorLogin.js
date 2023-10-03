// library imports
import React, { useState, useEffect } from "react";
import PatientNav from "../components/PatientNav";
import { useDispatch, useSelector } from "react-redux";
import { loadsingleDoctor } from "../redux/action";
import { useNavigate } from "react-router-dom";

// Material UI imports
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { FormControl, TextField, Typography } from "@mui/material";
import { Container } from "@mui/system";

// this components initial state
const inital = {
  email: "",
  password: "",
};

export default function DoctorLogin() {
  // declare variables
  const [localState, setLocalState] = useState(inital);
  const [loginerror, setloginerror] = useState("");
  const { email, password } = localState;
  const dispatch = useDispatch();
  const doctor = useSelector((state) => state.data.doctor);
  const navigate = useNavigate();

  // clear browsers local storage when page loads
  useEffect(() => {
    setloginerror("");
    localStorage.clear();
  }, []);

  // this function displays an error message if there is a problem with the signing in.
  useEffect(() => {
    setloginerror("");
    // if the authentication process returns an error, display the error
    if (doctor.msg != null) {
      setloginerror(doctor.msg);
      setLocalState(inital);
      return;
    }

    // if it returns with the doctors information, proceed with the authentication process
    if (doctor.id != null) {

      // this function authenticates the user
      const authenticate = (doctorPasswordfromDB) => {
        if (password !== doctorPasswordfromDB) {
          setloginerror("Login failed please try again");
          setLocalState(inital);
          return;
        } else {
          setLocalState(inital);
          setloginerror("");
          console.log(doctor["id"]);
          localStorage.setItem("doctor_id", doctor["id"]);
          localStorage.setItem("doctor_email", doctor["email"]);
          localStorage.setItem("doctor_name", doctor["name"]);
          localStorage.setItem("doctor_staffNumber", doctor["staffNumber"]);
          navigate("/doctorDashboard");
        }
      };

      const doctorEmailfromDB = doctor.email;
      const doctorPasswordfromDB = doctor.password;
      authenticate(doctorEmailfromDB, doctorPasswordfromDB);
    }
  }, [doctor]);

  // updates the values of local state variables with the data entered in by the user in the registration form
  const handleChange = (e) => {
    let { name, value } = e.target;
    setLocalState({ ...localState, [name]: value });
  };

  // this function attempts to retrieve the users data from the database for authentication.
  // returns the user data if the user is inside the database and an error message if user is not
  const handlesubmit = (e) => {
    e.preventDefault();
    setloginerror("");
    dispatch(loadsingleDoctor(email));
  };

  // React component that returns the login page
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
            <FormControl fullWidth={true} margin="normal">
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
            <FormControl fullWidth={true} margin="normal">
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
                fullWidth={true}
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
