import PatientNav from "../components/PatientNav";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  loadsingleDoctor,
  getPatients,
  addPatient,
  searchPatient,
} from "../redux/action";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Container } from "@mui/system";
import { CircularProgress, Grid } from "@mui/material";
import { FormControl, TextField } from "@mui/material";
import Modal from "@mui/material/Modal";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Pagination from "@mui/material/Pagination"

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
    if (
      doctorData == null ||
      !doctorData.doctor_id ||
      doctorData.staffType != "doctor"
    ) {
      navigate("/doctorLogin");
      return;
    }

    dispatch(getPatients(doctorData.doctor_id));
  },[]);


  useEffect(() => {
    if (msg) {
      setfinishedCreating(true);
    }
  }, [msg]);

  // this function closes the success pop up modal
  const handleClose = (event, reason) => {
    if (reason !== "backdropClick") {
      setfinishedCreating(false);
      setstate(inital);
    }
  };

  const handleChange = (e) => {
    let { name, value } = e.target;
    setstate({ ...state, [name]: value });
  };

  const handlesubmit = (e) => {
    e.preventDefault();
    const patientDetails = { name: patientName, doctorID: doctorData.doctor_id };
    setOpen(false);
    dispatch(addPatient(patientDetails));
  };

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

          <Container>
            <Box sx={{ marginTop: 5, flexGrow: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <Card
                    sx={{
                      align: "center",
                      padding: "20px",
                      boxShadow: 3,
                    }}
                  >
                    <Grid container>
                      <Grid item xs={12} sm={12} md={10} lg={10}>
                        <FormControl fullWidth={true} sx={{ height: "50px" }}>
                          <TextField
                            required
                            fullWidth={true}
                            type="text"
                            placeholder="Patient Search"
                            name="search"
                            onChange={handleSearchInputChange}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={12} md={2} lg={2}>
                        <Button
                          size="medium"
                          variant="contained"
                          sx={{
                            marginLeft: { xs: "0", md: "23px" },
                            marginTop: { xs: "20px", md: "0px" },
                            height: "54px",
                            paddingRight: "26px",
                            paddingLeft: "26px",
                            width: { xs: "100%", md: "auto" },
                          }}
                          onClick={() => setOpen(true)}
                        >
                          Add Patient
                        </Button>
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          </Container>

          <Container>
            <Box sx={{ marginTop: 5, marginBottom: 20, flexGrow: 1 }}>
              <Grid container spacing={2}>
                {displayPatients.map((patient) => (
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Card
                      sx={{
                        align: "center",
                        padding: "20px",
                        boxShadow: 1,
                      }}
                    >
                      <Grid container>
                        <Grid item xs={12} sm={12} md={6} lg={6}>
                          <CardContent>
                            <Typography sx={{ textAlign: "left" }}>
                              Paitent Name: {patient.name}
                            </Typography>
                            <Typography sx={{ textAlign: "left" }}>
                              Paitent id: {patient.id}
                            </Typography>
                          </CardContent>
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6}>
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
                        </Button>
                          </CardActions>
                        </Grid>
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
