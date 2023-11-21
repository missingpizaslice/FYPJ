import React, { useRef, useState, useEffect } from "react";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { sendnameback } from "../redux/action";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import PatientNav from "../components/PatientNav";
import "../index.css";

// import Button from "@mui/material/Button";

const Training_Page = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dataJSON = sessionStorage.getItem("data");
  const data = JSON.parse(dataJSON);
  console.log(data);

  const { msg } = useSelector((state) => state.data);
  const [networkActivity, setNetworkActivity] = useState(true);
  const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [buttonClicked, setButtonClicked] = useState(false); // Track button click state

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleStartTraining = () => {
    dispatch(sendnameback(data));
    handleCloseModal(); // Close the first modal on button click
    setButtonClicked(true); // Set button click state to true
  };

  useEffect(() => {
    if (msg === "Training Done") {
      navigate("/Webcam");
    }
  }, [msg, navigate]);

  useEffect(() => {
    // Open the second modal after 17 seconds, but only if the button is clicked
    if (buttonClicked) {
      const timerId = setTimeout(() => {
        setIsSecondModalOpen(true);
      }, 27000); // 17 seconds in milliseconds

      // Cleanup the timer on component unmount or when the second modal is opened
      return () => {
        clearTimeout(timerId);
      };
    }
  }, [buttonClicked]);

  // modal styling
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
    <div>
      <PatientNav />
      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <Box sx={style}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography id="modal-modal-title" variant="h6" component="h2">
              To begin training your model, please click the "Start Training"
              button.
            </Typography>
            <br />
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Once the training is complete, you will automatically be
              redirected to another page. Please wait patiently for the training
              to complete.
            </Typography>
            <br />
            <Typography id="modal-modal-title" variant="h6" component="h2">
              The training process may take a few minutes. Please do not leave
              or refresh this page during that process
            </Typography>
          </Box>

          <Button
            type="submit"
            variant="contained"
            fullWidth={true}
            sx={{ marginTop: "30px" }}
            onClick={handleStartTraining}
            size="lg"
          >
            Start Training
          </Button>
        </Box>
      </Modal>

      <Modal open={isSecondModalOpen}>
        {/* Content for the second modal */}
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Please wait while your model is being trained. You wil be redirected shortly
            <div
              className="spinners"
              style={{ position: "relative", left: "35%", marginTop: "30px" }}
            ></div>
          </Typography>
        </Box>
      </Modal>
    </div>
  );
};
export default Training_Page;
