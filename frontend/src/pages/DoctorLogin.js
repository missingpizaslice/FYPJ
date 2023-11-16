// library imports
import React, { useState, useEffect } from "react";
import PatientNav from "../components/PatientNav";
import { useDispatch, useSelector } from "react-redux";
import { loadsingleDoctor, loginAuth, setMessage, getPatients } from "../redux/action";
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
  const { doctor, msg } = useSelector((state) => state.data);
  const navigate = useNavigate();

  // clear browsers local storage when page loads
  useEffect(() => {
    dispatch(setMessage(""));
    setloginerror("");
    localStorage.clear();
  }, []);

  // this function displays an error message if there is a problem with the signing in.
  useEffect(() => {
    setloginerror("");
    // if the authentication process returns an error, display the error
    if (msg == "login successful") {
      dispatch(setMessage(""));
      setLocalState(inital);
      const doctorData = {
        doctor_id: doctor["id"],
        doctor_email: doctor["email"],
        doctor_name: doctor["name"],
        doctor_staffNumber: doctor["staffNumber"],
        staffType: doctor["staffType"],
      };
      localStorage.setItem("doctorData", JSON.stringify(doctorData));
      if (doctor["staffType"] == "doctor") {
        navigate("/doctorDashboard");
      } else {
        navigate("/admindashboard");
      }
    } else {
      setloginerror(msg);
      setLocalState(inital);
      return;
    }
  }, [msg]);

  // updates the values of local state variables with the data entered in by the user in the registration form
  const handleChange = (e) => {
    let { name, value } = e.target;
    setLocalState({ ...localState, [name]: value });
  };

  // this function attempts to retrieve the users data from the database for authentication.
  // returns the user data if the user is inside the database and an error message if user is not
  const handlesubmit = (e) => {
    e.preventDefault();

    var valiated = true;

    if (email == "" || password == "") {
      setloginerror("email or password field empty");
      setLocalState(inital);
      valiated = false;
    }

    if (valiated == true) {
      dispatch(loginAuth(localState));
    }
  };

  // this function authenticates the user
  // const authenticate = (doctorPasswordfromDB) => {
  //   if (password !== doctorPasswordfromDB) {
  //     setloginerror("Incorrect password. Please try again.");
  //     setLocalState(inital);
  //     return;
  //   } else {
  //     setLocalState(inital);
  //     setloginerror("");
  //     console.log(doctor["id"]);
  //     const doctorData = {
  //       doctor_id: doctor["id"],
  //       doctor_email: doctor["email"],
  //       doctor_name: doctor["name"],
  //       doctor_staffNumber: doctor["staffNumber"],
  //       staffType: doctor["staffType"],
  //     };
  //     localStorage.setItem("doctorData", JSON.stringify(doctorData));
  //     if (doctor["staffType"] == "doctor") {
  //       navigate("/doctorDashboard");
  //     } else {
  //       navigate("/admindashboard");
  //     }
  //   }
  // };

  // React component that returns the login page
  return (
    <>
      <PatientNav />

      <Container style={{ marginTop: "130px" }}>
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
            <Typography component="p" color={"red"}>
              {loginerror}
            </Typography>
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
