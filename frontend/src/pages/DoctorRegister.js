// library imports
import React, { useState, useEffect } from "react";
import PatientNav from "../components/PatientNav";
import { useDispatch, useSelector } from "react-redux";
import { addDoctor,setMessage } from "../redux/action";

// material UI imports
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { FormControl, MenuItem, Select, TextField, Typography } from "@mui/material";
import { Container } from "@mui/system";
import Modal from "@mui/material/Modal";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

// this components initial state
const inital = {
  email: "",
  name: "",
  staffNumber: "",
  password: "",
  confirmPassword: "",
  staffType: "",
};

export default function DoctorRegister() {
  // declare variables
  const [state, setstate] = useState(inital);
  const { email, name, staffNumber, password, confirmPassword, staffType } = state;
  const dispatch = useDispatch();
  const [registrationError, setregistrationError] = useState("");
  const msg = useSelector((state) => state.data.msg);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    dispatch(setMessage(""));

    document.body.style.opacity = 0;
    const fadeIn = () => {
      let opacity = parseFloat(document.body.style.opacity);
      if (opacity < 1) {
        opacity += 0.02;
        document.body.style.opacity = opacity;
        requestAnimationFrame(fadeIn);
      }
    };
    requestAnimationFrame(fadeIn);
  }, []);

  // this function closes the success pop up modal
  const handleClose = (event, reason) => {
    if (reason !== "backdropClick") {
      setOpen(false);
      setstate(inital);
    }
  };

  // updates the values of local state variables with the data entered in by the user in the registration form
  const handleChange = (e) => {
    let { name, value } = e.target;
    setstate({ ...state, [name]: value });
  };

  // display error messages if registration fails and displays the success pop up if registration succeeds
  useEffect(() => {
    setregistrationError("");
    if (msg == "new doctor has been added successfully") {
      setOpen(true);
    } else {
      setregistrationError(msg);
      setstate(inital);
      return;
    }
  }, [msg]);

  // function that updates the database with a new user
  const handlesubmit = (e) => {
    e.preventDefault();
    dispatch(addDoctor(state));
    setstate(inital);
  };

  // modal style
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
              Register
            </Typography>
            <Typography component="p" color={"red"}>
              {registrationError}
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
            <FormControl fullWidth={true} margin="normal">
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
            <FormControl fullWidth={true} margin="normal">
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
            <FormControl fullWidth={true} margin="normal">
              <Typography component="p" align="left">
                Account Type
              </Typography>
              <Select
                required
                name="staffType"
                value={staffType || ""}
                onChange={handleChange}
              >
                <MenuItem value={"Doctor"}>Doctor</MenuItem>
                <MenuItem value={"Admin"}>
                  Admin
                </MenuItem>
              </Select>
            </FormControl>
            <div className=".d-grid gap-2 mt-2">
              <Button
                type="submit"
                variant="contained"
                fullWidth={true}
                sx={{ marginTop: "20px" }}
              >
                Register
              </Button>
            </div>
          </Box>
        </Box>
      </Container>

      <Modal open={open}>
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
              New Doctor Added Successfully
            </Typography>
          </Box>

          <Button
            type="submit"
            variant="contained"
            fullWidth={true}
            sx={{ marginTop: "20px" }}
            onClick={handleClose}
          >
            OK!
          </Button>
        </Box>
      </Modal>
    </>
  );
}
