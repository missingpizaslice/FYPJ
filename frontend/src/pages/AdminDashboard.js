import PatientNav from "../components/PatientNav";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getDoctors } from "../redux/action";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Container } from "@mui/system";
import { FormControl, TextField, Tooltip } from "@mui/material";
import { Grid } from "@mui/material";
import Pagination from "@mui/material/Pagination";
import AddIcon from "@mui/icons-material/Add";
import Fab from "@mui/material/Fab";

const inital = {
  search: "",
  patientName: "",
};

export default function AdminDashboard() {
  const doctor = useSelector((state) => state.data.doctor);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { doctors } = useSelector((state) => state.data);

  // const [loading, setloading] = useState(false);
  const [state, setstate] = useState(inital);
  const { patientName, search } = state;
  const doctorDataJSON = localStorage.getItem("doctorData");
  const doctorData = JSON.parse(doctorDataJSON);
  const [searchQuery, setSearchQuery] = useState("");

  const fiterdoctors = doctors.filter(
    (doctor) =>
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.id.includes(searchQuery.toLowerCase()) ||
      doctor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.staffNumber.includes(searchQuery.toLowerCase())
  );

  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedDoctors = fiterdoctors.slice(startIndex, endIndex);

  useEffect(() => {
    if (
      doctorData == null ||
      !doctorData.doctor_id ||
      doctorData.staffType != "admin"
    ) {
      navigate("/doctorLogin");
      return;
    }

    console.log(doctorData);
    dispatch(getDoctors());

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

  const handleChange = (e) => {
    let { name, value } = e.target;
    setstate({ ...state, [name]: value });
  };

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  return (
    <>
      {doctorData && doctorData.doctor_id && doctorData.staffType == "admin" ? (
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
                      animation: "fadeIn 0.4s ease-in-out",
                    }}
                  >
                    <FormControl
                      fullWidth={true}
                      sx={{
                        height: "50px",
                      }}
                    >
                      <TextField
                        required
                        fullWidth={true}
                        type="text"
                        placeholder="Search"
                        name="email"
                        onChange={handleSearchInputChange}
                      />
                    </FormControl>
                    <Box sx={{ "& > :not(style)": { m: 1 } }}>
                      <Tooltip
                        title={<h2>Add Doctor</h2>}
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
                          onClick={() => navigate("/doctorRegistration")}
                        >
                          <AddIcon />
                        </Fab>
                      </Tooltip>
                    </Box>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          </Container>

          <Container maxWidth="md">
            <Box sx={{ marginTop: 5, marginBottom: 20, flexGrow: 1 }}>
              <Grid container spacing={2}>
                {displayedDoctors.map((doctor) => (
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
                              id: {doctor.id}
                            </Typography>
                            <Typography sx={{ textAlign: "left" }}>
                              Email: {doctor.email}
                            </Typography>
                            <Typography sx={{ textAlign: "left" }}>
                              Number: {doctor.staffNumber}
                            </Typography>
                            <Typography sx={{ textAlign: "left" }}>
                              Name: {doctor.name}
                            </Typography>
                            <Typography sx={{ textAlign: "left" }}>
                              Type: {doctor.staffType}
                            </Typography>
                          </CardContent>
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6}></Grid>
                      </Grid>
                    </Card>
                  </Grid>
                ))}
              </Grid>
              <Pagination
                count={Math.ceil(fiterdoctors.length / itemsPerPage)}
                page={page}
                onChange={(event, value) => setPage(value)}
                color="primary"
                sx={{ paddingTop: "30px" }}
              />
            </Box>
          </Container>
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
