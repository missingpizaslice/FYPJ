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
import { FormControl, TextField } from "@mui/material";
import { Grid } from "@mui/material";
import Pagination from "@mui/material/Pagination";

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

  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedDoctors = doctors.slice(startIndex, endIndex);

  useEffect(() => {
    if (doctorData == null || !doctorData.doctor_id) {
      navigate("/doctorLogin");
      return;
    }

    console.log(doctorData);
    dispatch(getDoctors());
  }, []);

  const handleChange = (e) => {
    let { name, value } = e.target;
    setstate({ ...state, [name]: value });
  };

  return (
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
                        name="email"
                        // onChange={onChange}
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
                      onClick={() => navigate("/doctorRegistration")}
                    >
                      Add Doctor
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
                          Staff id: {doctor.id}
                        </Typography>
                        <Typography sx={{ textAlign: "left" }}>
                          Staff Email: {doctor.email}
                        </Typography>
                        <Typography sx={{ textAlign: "left" }}>
                          Staff Number: {doctor.staffNumber}
                        </Typography>
                        <Typography sx={{ textAlign: "left" }}>
                          Staff Name: {doctor.name}
                        </Typography>
                        <Typography sx={{ textAlign: "left" }}>
                          Staff Type: {doctor.staffType}
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
            count={Math.ceil(doctors.length / itemsPerPage)}
            page={page}
            onChange={(event, value) => setPage(value)}
            color="primary" 
            sx={{paddingTop: "30px"}}
          />
        </Box>
      </Container>
    </>
  );
}
