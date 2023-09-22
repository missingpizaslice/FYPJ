import React, { useEffect, useRef, useState } from "react";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import { Container, Typography } from "@mui/material";
import Modal from "@mui/material/Modal";
import { FormControl, TextField } from "@mui/material";

export default function Patient() {
  const videoRef = useRef(null);
  const [videoOn, setVideonOn] = useState(false);
  const [open, setOpen] = useState(false);

  const handleClose = (event, reason) => {
    if (reason !== "backdropClick") {
      startWebCam();
      setOpen(false);
    }
  };

  const startWebCam = () => {
    setVideonOn(!videoOn);
  };

  useEffect(() => {
    setOpen(true);
  }, []);

  useEffect(() => {
    let video = videoRef.current;

    if (videoOn == false) {
      if (video.srcObject != null) {
        video.srcObject.getTracks()[0].stop();
        console.log(video.srcObject.getTracks()[0]);
      }
    } else {
      navigator.mediaDevices
        .getUserMedia({ video: { width: 720 } })
        .then((stream) => {
          video.srcObject = stream;
          video.play();
        })
        .catch((err) => {
          console.error("error:", err);
        });
    }
  }, [videoOn]);

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
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" sx={{ background: "#2668c3" }}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Pain Analysis
            </Typography>
          </Toolbar>
        </AppBar>
      </Box>

      <Container
        sx={{
          marginTop: 8,
          marginBottom: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <video ref={videoRef} />
      </Container>

      <Button
        variant="contained"
        sx={{ margin: 2, padding: "10px" }}
        onClick={startWebCam}
      >
        {videoOn ? "Stop" : "Start"}
      </Button>

      <Modal open={open}>
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            enter your user ID
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            to continue please enter your user ID assigned to you.
          </Typography>
          <FormControl fullWidth="true" margin="normal">
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
            fullWidth="true"
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
