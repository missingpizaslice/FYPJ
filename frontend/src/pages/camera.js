import React, { useRef, useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import Button from "@mui/material/Button";
import PatientNav from "../components/PatientNav";
import Box from "@mui/material/Box";
// import Button from "@mui/material/Button";

const Webcam = () => {
  const videoRef = useRef();
  const [isStreaming, setIsStreaming] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [filled, setFilled] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const dataJSON = sessionStorage.getItem("data");
  const data = JSON.parse(dataJSON);
  console.log(data);

  useEffect(() => {
    if (filled < 100 && isRunning) {
      setTimeout(() => setFilled((prev) => prev + 2), 50);
    }
  }, [filled, isRunning]);

  const toggleStream = () => {
    setIsLoading(true);
    if (isStreaming) {
      // Stop the video stream by setting the source to an empty string
      videoRef.current.src = "";
      setIsStreaming(false);
      setIsRunning(false);
      setFilled(0);
      // Hide the loading modal immediately when stopping
      setIsLoading(true);
    } else {
      // Simulate loading time
      setIsRunning(true);

      setTimeout(() => {
        // Start the video stream
        videoRef.current.src = "http://localhost:5000/webcam";
        setIsStreaming(true);
        setIsRunning(true);

        // Hide the loading modal after a timeout
        setTimeout(() => {
          setIsLoading(false);
        }, 4000); // Adjust the timeout as needed
      });
    }
  };

  return (
    <>
      <PatientNav />
      <div style={{ marginTop: "110px" }}>
        <Box>
          <div
            style={{
              boxShadow: 2,
              textAlign: "center",
              marginTop: "50px",
            }}
          >
            <div
              style={{
                position: "relative",
                width: "640px",
                height: "400px",
                overflow: "hidden",
                background: "black",
                margin: "0 auto",
                boxShadow:
                  "0 3px 10px rgb(0 0 0 / 0.2); /* Add a subtle shadow ",
              }}
            >
              <img
                style={{
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                }}
                ref={videoRef}
              />
            </div>
              {/* <Button
                className="buttons"
                onClick={toggleStream}
                size="lg"
                style={{ backgroundColor: "#a66cff" }}
              >
                {isStreaming ? "Stop Stream" : "Start Stream"}
              </Button> */}
              <Button
                type="submit"
                variant="contained"
                sx={{ marginTop: "30px" }}
                onClick={toggleStream}
              >
                {isStreaming ? "Stop analysis" : "Start analysis"}
              </Button>
          </div>
        </Box>
        {isStreaming && (
          <Modal
            className="overlay"
            show={isLoading}
            onHide={() => setIsLoading(false)}
          >
            <div className="modal-content">
              <h3 style={{ position: "relative", bottom: "20px" }}>
                Model Loading .....
              </h3>
              <div className="progressbar">
                <div
                  style={{
                    height: "100%",
                    width: `${filled}%`,
                    backgroundColor: "#2e79d5",
                    transition: "width 0.5s",
                  }}
                ></div>
                <span className="progressPercent">{filled}%</span>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </>
  );
};

export default Webcam;
