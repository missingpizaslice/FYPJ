// library imports
import React, { useState, useEffect } from "react";
import PatientNav from "../components/PatientNav";
import { useDispatch, useSelector } from "react-redux";
import {
  loadsingleDoctor,
  loginAuth,
  passwordUpdate,
  setMessage,
} from "../redux/action";
import { useNavigate } from "react-router-dom";

// Material UI imports
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { FormControl, TextField, Typography } from "@mui/material";
import { Container } from "@mui/system";
import Modal from "@mui/material/Modal";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

// this components initial state
const inital = {
  currentPassword: "",
  newPassword: "",
  confirmNewPassword: "",
};

export default function DoctorUpdatePassword() {
  // declare variables
  const [state, setstate] = useState(inital);
  const [loginerror, setloginerror] = useState("");
  const { currentPassword, newPassword, confirmNewPassword } = state;
  const dispatch = useDispatch();
  const { doctor, msg } = useSelector((state) => state.data);
  const navigate = useNavigate();
  const doctorDataJSON = localStorage.getItem("doctorData");
  const doctorData = JSON.parse(doctorDataJSON);
  const [updatefinished, setupdatefinished] = useState(false);

  // clear browsers local storage when page loads
  useEffect(() => {
    if (doctorData == null || !doctorData.doctor_id) {
      navigate("/doctorLogin");
      return;
    }
    setupdatefinished(false);
    dispatch(setMessage(""));
    setloginerror("");
  }, []);

  useEffect(() => {
    setloginerror("");
    // if the authentication process returns an error, display the error
    if (msg == "password successfully updated") {
      console.log("successfully updated doctor details");
      setupdatefinished(true);
    } else {
      setloginerror(msg);
      setstate(inital);
      return;
    }
  }, [msg]);

  // updates the values of local state variables with the data entered in by the user in the registration form
  const handleChange = (e) => {
    let { name, value } = e.target;
    setstate({ ...state, [name]: value });
  };

  // this function attempts to retrieve the users data from the database for authentication.
  // returns the user data if the user is inside the database and an error message if user is not
  const handlesubmit = (e) => {
    e.preventDefault();

    if (newPassword == currentPassword) {
      setloginerror("New password cannot be the same as old password");
      setstate(inital);
      return;
    }

    if (
      currentPassword == "" ||
      newPassword == "" ||
      confirmNewPassword == ""
    ) {
      setloginerror("Please fill all fields");
      setstate(inital);
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setloginerror("Passwords do not match");
      setstate(inital);
      return;
    }

    const data = {
      currentPassword: currentPassword,
      newPassword: newPassword,
      confirmNewPassword: confirmNewPassword,
      doctor_id: doctorData.doctor_id,
    };

    console.log(data);
    dispatch(passwordUpdate(data));
    setstate(inital);
  };

  const handleClose = (event, reason) => {
    if (reason !== "backdropClick") {
      setupdatefinished(false);
      if (doctorData.staffType == "doctor") {
        dispatch(setMessage(""));
        navigate("/doctorDashboard");
      } else {
        dispatch(setMessage(""));
        navigate("/adminDashboard");
      }
    }
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

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
              Update Password
            </Typography>
            <Typography component="p" color={"red"}>
              {loginerror}
            </Typography>
            <FormControl fullWidth={true} margin="normal">
              <Typography component="p" align="left">
                Current Passwordss
              </Typography>
              <TextField
                required
                fullWidth
                type="text"
                placeholder="************"
                name="currentPassword"
                value={currentPassword || ""}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl fullWidth={true} margin="normal">
              <Typography component="p" align="left">
                New Password
              </Typography>
              <TextField
                required
                fullWidth
                type="password"
                placeholder="************"
                name="newPassword"
                value={newPassword || ""}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl fullWidth={true} margin="normal">
              <Typography component="p" align="left">
                Confirm New Password
              </Typography>
              <TextField
                required
                fullWidth
                type="password"
                placeholder="************"
                name="confirmNewPassword"
                value={confirmNewPassword || ""}
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
                Change Password
              </Button>
            </div>
          </Box>
        </Box>
      </Container>

      <Modal open={updatefinished}>
        <Box sx={style}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <CheckCircleIcon color="success" fontSize="large" />
            <Typography id="modal-modal-title" variant="h6" component="h2">
              {msg}
            </Typography>
          </Box>

          <Button
            type="submit"
            variant="contained"
            fullWidth={true}
            sx={{ marginTop: "30px" }}
            onClick={handleClose}
          >
            Back
          </Button>
        </Box>
      </Modal>
    </>
  );
}
