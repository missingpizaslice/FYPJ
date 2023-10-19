import React from "react";
import Button from "@mui/material/Button";
import { Grid, Typography } from "@mui/material";
import Container from "@mui/material/Container";
import PatientNav from "../components/PatientNav";
import { useNavigate } from "react-router-dom";

function Homepage() {
  const navigate = useNavigate();

  return (
    <>
      <PatientNav />

      <Container
        sx={{
          marginTop: "11%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          maxWidth: "800px",
          marginBottom: "70px",
          boxShadow: 5,
          borderRadius: "5px",
          padding: "25px",
        }}
      >
        <Typography component="h1" variant="h4" sx={{ padding: "20px" }}>
          Which are you?
        </Typography>
        <Grid
          container
          spacing={2}
          sx={{ paddingTop: "25px", paddingBottom: "25px" }}
        >
          <Grid item xs={12} md={6}>
            {/* <img
              src="images/stethoscope.png"
              alt="hospital staff"
              width="300px"
              height="300px"
            /> */}
            <Button
              type="submit"
              variant="contained"
              sx={{
                paddingTop: "20px",
                paddingBottom: "20px",
                maxWidth: "250px",
                marginTop: "20px",
              }}
              fullWidth={true}
              onClick={() => navigate("/doctorLogin")}
            >
              <Typography component="h1" variant="h5" align="left">
                Hospital Staff
              </Typography>
            </Button>
          </Grid>
          <Grid item xs={12} md={6}>
            {/* <img
              src="images/user.png"
              alt="Patienit"
              width="300px"
              height="300px"
            /> */}
            <Button
              type="submit"
              variant="contained"
              sx={{
                paddingTop: "20px",
                paddingBottom: "20px",
                maxWidth: "250px",
                marginTop: "20px",
              }}
              fullWidth={true}
              onClick={() => navigate("/PredictForm")}
            >
              <Typography component="h1" variant="h5" align="left">
                Patient
              </Typography>
            </Button>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default Homepage;
