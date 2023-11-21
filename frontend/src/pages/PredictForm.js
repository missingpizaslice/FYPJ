import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPatientModel } from "../redux/action";
import PatientNav from "../components/PatientNav";
import { Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { FormControl, TextField, Typography } from "@mui/material";
import { Container } from "@mui/system";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { FormHelperText } from "@mui/material";

function YourForm() {
  const [loginerror, setloginerror] = useState("");
  const [name, setName] = useState();
  const [activity, setActivity] = useState();
  const [duration, setDuration] = useState();
  const { msg } = useSelector((state) => state.data);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [nullerror, setNullError] = useState("");

  useEffect(() => {
    setloginerror("");
    setNullError("");
    // Check if the authentication process returns an error
    if (msg === "the account does not exist") {
      // sessionStorage.clear("")
      setloginerror(msg);
      console.log(loginerror);
    } else if (msg === "Account exists with model") {
      navigate("/Webcam");
    } else if (msg === "Account exists without model") {
      navigate("/Training_page");
    }
  }, [msg]);

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleActivityChange = (e) => {
    setActivity(e.target.value);
  };

  const handleDurationChange = (e) => {
    setDuration(e.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    var valiated = true;
    if (!name || !activity || !duration) {
      setNullError("Please fill in all the fields.");
      return;
    }

    if (valiated == true) {
      // Clear nullError if all fields are filled
      setNullError("");

      const initial = {
        name: name,
        activity: activity,
        duration: duration,
      };

      // Handle form submission here, e.g., send the 'name' to your server
      sessionStorage.setItem("data", JSON.stringify(initial));
      dispatch(addPatientModel(initial));

      // Clear input fields
      setName("");
      setActivity("");
      setDuration("");
    }
  };

  return (
    <>
      <PatientNav />

      <Container style={{ marginTop: "130px" }}>
        <Box
          sx={{
            marginTop: 5,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              maxWidth: "400px",
              // marginBottom: "10px",
              boxShadow: 2,
              padding: "50px",
              borderRadius: "5px",
            }}
          >
            <Typography component="h1" variant="h4">
              Details
            </Typography>
            <Typography
              style={{ marginTop: "16px" }}
              component="p"
              color={"red"}
            >
              {nullerror}
            </Typography>
            <FormControl
              variant="outlined"
              fullWidth
              style={{ marginTop: "16px", maxWidth: 500 }}
            >
              <Form.Group>
                <Box
                  className="inputs"
                  sx={{ width: 500, maxWidth: "100%", marginTop: "16px" }}
                >
                  <TextField
                    fullWidth
                    type="text"
                    label="Name"
                    id="name"
                    name="Name"
                    value={name}
                    error={Boolean(loginerror)}
                    onChange={handleNameChange}
                  />
                  <FormHelperText error>{loginerror}</FormHelperText>
                </Box>
              </Form.Group>
            </FormControl>
            <FormControl fullWidth style={{ marginTop: "16px", maxWidth: 500 }}>
              <Form.Group>
                <Box
                  className="inputs"
                  sx={{ width: 500, maxWidth: "100%", marginTop: "0px" }}
                >
                  <TextField
                    fullWidth
                    type="text"
                    label="Activity"
                    name="activity"
                    id="activity"
                    value={activity}
                    onChange={handleActivityChange}
                  />
                </Box>
              </Form.Group>
            </FormControl>
            <FormControl
              className="inputs"
              fullWidth
              style={{ width: 500, maxWidth: "100%", marginTop: "16px" }}
            >
              <InputLabel id="demo-simple-select-helper-label">
                Duration
              </InputLabel>
              <Select
                labelId="demo-simple-select-helper-label"
                id="duration"
                name="duration"
                label="duration"
                value={duration || ""}
                onChange={handleDurationChange}
              >
                <MenuItem value="1-3 hours">1-3 hours</MenuItem>
                <MenuItem value="3-5 hours">3-5 hours</MenuItem>
                <MenuItem value="6-9 hours">6-9 hours</MenuItem>
                <MenuItem value=">9 hours"> more than 9 hours</MenuItem>
                <MenuItem value="None">None</MenuItem>
              </Select>
            </FormControl>
            <div className=".d-grid gap-2 mt-2">
              <Button
                type="submit"
                variant="contained"
                fullWidth={true}
                sx={{ marginTop: "20px" }}
              >
                Submit
              </Button>
            </div>
          </Box>
        </Box>
      </Container>
    </>
  );
}

export default YourForm;
