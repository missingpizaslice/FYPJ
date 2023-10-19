import React, { useState } from 'react';
import { useDispatch } from "react-redux";
import { addPatientModel } from "../redux/action";
import PatientNav from "../components/PatientNav";
import {Form} from "react-bootstrap";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { FormControl, TextField, Typography } from "@mui/material";
import { Container } from "@mui/system";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

function YourForm() {
  // const [loginerror, setloginerror] = useState("");
  const [name, setName] = useState();
  const [activity, setActivity] = useState();
  const [duration, setDuration] = useState();
  const dispatch = useDispatch();


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
    const initial = {
      name:name,
      activity:activity,
      duration:duration
    }
    // Handle form submission here, e.g., send the 'name' to your server
    dispatch(addPatientModel(initial))
    setName("");
    setActivity("");
    setDuration("");
    // You can use the 'name' variable to access the user's input
    console.log('Name:', initial);
  };

  return (
    <>
    <PatientNav />

    <Container style={{ marginTop: "0px" }}>
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
        {/* <Typography component="p">{loginerror}</Typography> */}
        <FormControl fullWidth style={{marginTop: "16px",maxWidth: 500 }}>
                    <Form.Group>
                        <Box className="inputs" sx={{width: 500,maxWidth: '100%',marginTop: "16px"}}><TextField fullWidth 
          type="text"
          label="Name"
          id="name"
          name="Name"
          value={name}
          onChange={handleNameChange}
                        />
                        </Box>
                    </Form.Group>
                    </FormControl>
        <FormControl fullWidth style={{marginTop: "16px",maxWidth: 500 }}>
                    <Form.Group>
                        <Box className="inputs" sx={{width: 500,maxWidth: '100%',marginTop: "0px"}}><TextField fullWidth 
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
        <FormControl className="inputs" fullWidth style={{width: 500,maxWidth: '100%',marginTop: "16px"}}>
                <InputLabel id="demo-simple-select-helper-label">Duration</InputLabel>
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
    // <div className='body-pk'>
    // <div className="container-pk">
    //   <form className="form-pk" onSubmit={handleSubmit}>
    //     <h2>Details</h2>
    //     <input
    //       type="text"
    //       id="name"
    //       placeholder='Name'
    //       name="Name"
    //       value={name}
    //       onChange={handleNameChange}
    //       required
    //     />
    //       <input
    //       type="text"
    //       id="activity"
    //       name="activity"
    //       placeholder='Activity'
    //       value={activity}
    //       onChange={handleActivityChange}
    //       required
    //     />
    //     <select
    //     id="duration"
    //     name="duration"
    //     value={duration}
    //     onChange={handleDurationChange}
    //   >
    //     <option value="" disabled selected>Select a duration</option>
    //     <option value="1-3 hours">1-3 hour</option>
    //     <option value="3-5 hours">3-5 hours</option>
    //     <option value="6-9 hours">6-9 hours</option>
    //     <option value=">9 hours"> more than 9 hours</option>
    //     <option value="None">None</option>
    //   </select>
    //     <div className="center-button-pk">
    //       <button type="submit">Enter</button>
    //     </div>
    //   </form>
    // </div>
    // </div>
  );
}

export default YourForm;
