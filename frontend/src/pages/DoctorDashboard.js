import PatientNav from "../components/PatientNav";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  loadsingleDoctor,
  getPatients,
  addPatient,
  searchPatient,
  setMessage,
  clearMessage,
} from "../redux/action";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Container } from "@mui/system";
import { CircularProgress, Grid } from "@mui/material";
import Modal from "@mui/material/Modal";
import Pagination from "@mui/material/Pagination";
import { FormControl, TextField, Tooltip } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AddIcon from "@mui/icons-material/Add";
import Fab from "@mui/material/Fab";
import InsightsIcon from "@mui/icons-material/Insights";
import ArchiveIcon from "@mui/icons-material/Archive";
import DashboardIcon from "@mui/icons-material/Dashboard";

const inital = {
  search: "",
  patientName: "",
};

export default function DoctorDashboard() {
  const doctor = useSelector((state) => state.data.doctor);
  const doctor_id = localStorage.getItem("doctor_id");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { patients, msg } = useSelector((state) => state.data);
  const [open, setOpen] = useState(false);
  // const [loading, setloading] = useState(false);
  const [finishedCreating, setfinishedCreating] = useState(false);
  const [state, setstate] = useState(inital);
  const { patientName, search } = state;
  const doctorDataJSON = localStorage.getItem("doctorData");
  const doctorData = JSON.parse(doctorDataJSON);
  const [searchQuery, setSearchQuery] = useState("");

  const filterPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.id.includes(searchQuery.toLowerCase())
  );

  const [page, setPage] = useState(1);
  const itemsPerPage = 5; // Change this value as needed

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayPatients = filterPatients.slice(startIndex, endIndex);

  useEffect(() => {
    console.log("message on load" + msg);
    dispatch(getPatients(doctorData.doctor_id));

    if (
      doctorData == null ||
      !doctorData.doctor_id ||
      doctorData.staffType != "doctor"
    ) {
      navigate("/doctorLogin");
      return;
    }
  }, []);

  // this function closes the success pop up modal
  const handleClose = (e) => {
    e.preventDefault();
    dispatch(clearMessage(""));
    setfinishedCreating(false);
    console.log("message on hannlde close" + msg);
  };

  const handleChange = (e) => {
    let { name, value } = e.target;
    setstate({ ...state, [name]: value });
  };

  const handlesubmit = (e) => {
    e.preventDefault();
    const patientDetails = {
      name: patientName,
      doctorID: doctorData.doctor_id,
    };
    setOpen(false);
    dispatch(addPatient(patientDetails));
  };

  useEffect(() => {
    if (msg) {
      console.log("message on message value change " + msg);
      setfinishedCreating(true);
    }
  }, [msg]);

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

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
    <>
      {doctorData &&
      doctorData.doctor_id &&
      doctorData.staffType == "doctor" ? (
        <>
          <PatientNav />

          <Container maxWidth="md">
            <Box sx={{ marginTop: "130px", flexGrow: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <Card
                    sx={{
                      align: "center",
                      padding: "20px",
                      boxShadow: 3,
                    }}
                  >
                    <FormControl fullWidth={true} sx={{ height: "50px" }}>
                      <TextField
                        required
                        fullWidth={true}
                        type="text"
                        placeholder="Patient Search"
                        name="search"
                        onChange={handleSearchInputChange}
                        // onKeyDown={handlesearch}
                      />
                    </FormControl>
                    <Tooltip
                      title="Add Patient"
                      placement="left"
                      arrow
                    >
                      <Fab
                        variant="contained"
                        color="primary"
                        sx={{
                          position: "fixed",
                          bottom: 50,
                          right: 50,
                        }}
                        onClick={() => setOpen(true)}
                      >
                        <AddIcon />
                      </Fab>
                    </Tooltip>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          </Container>

          <Container maxWidth="md">
            <Box sx={{ marginTop: 5, marginBottom: 20, flexGrow: 1 }}>
              <Grid container spacing={2}>
                {displayPatients.map((patient) => (
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Card
                      sx={{
                        align: "center",
                        padding: "20px",
                        boxShadow: 2,
                        animation: "fadeIn 0.4s ease-in-out",
                      }}
                    >
                      <Grid container>
                        <Grid item xs={12} sm={12} md={6} lg={6}>
                          <CardContent>
                            <Typography sx={{ textAlign: "left" }}>
                              Paitent id: {patient.id}
                            </Typography>
                            <Typography sx={{ textAlign: "left" }}>
                              Paitent Name: {patient.name}
                            </Typography>
                            <Typography sx={{ textAlign: "left" }}>
                              Paitent Username: {patient.username}
                            </Typography>
                          </CardContent>
                        </Grid>
                        {/* <Grid item xs={12} sm={12} md={6} lg={6}>
                          <CardActions>
                          <Button
                          size="medium"
                          variant="outlined"
                          sx={{
                            marginLeft: { xs: "0", md: "auto" },
                            marginTop: { xs: "0px", md: "10px" },
                            height: "55px",
                          }}
                          onClick={() => {
                            sessionStorage.setItem('patient_id', patient.id);
                            navigate("/NewNotes")}
                          }
                        >
                          View Records
                        </Button> */}
                        <Tooltip
                          title="View Records"
                          placement="top"
                          arrow
                        >
                          <Button
                            size="large"
                            variant="primary"
                            sx={{
                              marginLeft: { xs: "0", md: "auto" },
                              marginTop: { xs: "0px", md: "10px" },
                              height: "63px",
                              borderRadius: "50%",
                              transition: "0.3s",
                              "&:hover": {
                                backgroundColor: "#2e79d5", // Change the background color on hover
                                color: "white", // Change the text color on hover
                              },
                            }}
                            onClick={() => {
                              sessionStorage.setItem("patient_id", patient.id);
                              navigate("/NewNotes");
                            }}
                          >
                            <DashboardIcon />
                          </Button>
                        </Tooltip>
                        {/* </CardActions> */}
                        {/* </Grid> */}
                      </Grid>
                    </Card>
                  </Grid>
                ))}
              </Grid>
              <Pagination
                count={Math.ceil(filterPatients.length / itemsPerPage)}
                page={page}
                onChange={(event, value) => setPage(value)}
                color="primary"
                sx={{ paddingTop: "30px" }}
              />
            </Box>
          </Container>

          <Modal open={open}>
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Create New Patient
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                Please enter the name of your patient in the form field below
              </Typography>
              <FormControl fullWidth={true} margin="normal">
                <Typography component="p" align="left">
                  Patient Name
                </Typography>
                <TextField
                  required
                  fullWidth
                  type="text"
                  placeholder="Jason Loh"
                  name="patientName"
                  onChange={handleChange}
                />
              </FormControl>
              <Button
                type="submit"
                variant="contained"
                fullWidth={true}
                sx={{ marginTop: "20px" }}
                onClick={handlesubmit}
              >
                Add Patient
              </Button>
            </Box>
          </Modal>

          <Modal open={finishedCreating}>
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
                OK!
              </Button>
            </Box>
          </Modal>
        </>
      ) : null}
    </>
  );
}

const fadeIn = `
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

// Add the CSS to the head of the document
const style = document.createElement("style");
style.innerHTML = fadeIn;
document.head.appendChild(style);
