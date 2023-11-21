// library imports
import React, { useEffect, useRef, useState } from "react";

// material UI imports
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Container, Typography } from "@mui/material";
import Modal from "@mui/material/Modal";
import { FormControl, TextField } from "@mui/material";

// component imports
import PatientNav from "../components/PatientNav";

export default function Patient() {
  const videoRef = useRef(null);
  const [videoOn, setVideonOn] = useState(false);
  const [open, setOpen] = useState(false);

  // function to close the modal that first appears when the user accesses the page
  const handleClose = (event, reason) => {
    if (reason !== "backdropClick") {
      startWebCam();
      setOpen(false);
    }
  };

  // function used to start the webcam
  const startWebCam = () => {
    setVideonOn(!videoOn);
  };

  // makes the modal appear when the page initially loads
  useEffect(() => {
    setOpen(true);
  }, []);

  // function to stream the video captured by the webcam to the video element in the browser
  useEffect(() => {
    let video = videoRef.current;

    // in video on set to false, stop broadcasting the video feed
    if (videoOn == false) {
      if (video.srcObject != null) {
        video.srcObject.getTracks()[0].stop();
        console.log(video.srcObject.getTracks()[0]);
      }
    }
    // in video on set to true, start broadcasting the video feed
    else {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          video.srcObject = stream;
          video.play();
        })
        .catch((err) => {
          console.error("error:", err);
        });
    }
  }, [videoOn]);

  // constant used to style the modal
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
      <Container sx={{ marginTop: "130px" }}>
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              maxWidth: "640px",
              marginBottom: "70px",
              boxShadow: 2,
              padding: "50px",
              borderRadius: "5px",
            }}
          >
            <Container sx={{ width: "100%" }}>
              <video sx={{ width: "100%", maxWidth: "640px" }} ref={videoRef} />
            </Container>

          </Box>
          
          <Button
              variant="contained"
              sx={{ margin: 2, padding: "10px" }}
              onClick={startWebCam}
            >
              {videoOn ? "Stop" : "Start"}
            </Button>
        </Box>
      </Container>

      <Modal open={open}>
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            enter your user ID
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            to continue please enter your user ID assigned to you.
          </Typography>
          <FormControl fullWidth={true} margin="normal">
            <Typography component="p" align="left">
              User ID
            </Typography>
            <TextField
              required
              fullWidth
              type="text"
              placeholder="12345E"
              name="size"
            />
          </FormControl>
          <Button
            type="submit"
            variant="contained"
            fullWidth={true}
            sx={{ marginTop: "20px" }}
            onClick={handleClose}
          >
            Begin
          </Button>
        </Box>
      </Modal>
    </>
  );
}
