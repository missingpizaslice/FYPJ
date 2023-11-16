import React, { useEffect, useState, useRef } from "react";
import { getFrames } from "../redux/action";
import { useDispatch, connect } from "react-redux";
import PatientNav from "../components/PatientNav";
import { Container } from "@mui/system";

const SubmitPredForm = () => {
  return (
    <>
      <PatientNav />

      <Container sx={{ marginTop: "130px" }}>
        <h1>Done</h1>
      </Container>
    </>
  );
};

export default SubmitPredForm;

//   const navigate = useNavigate();

//   return (
//     <>
//       <PatientNav />

//       <Container
//         sx={{
//           marginTop: "11%",
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//           maxWidth: "800px",
//           marginBottom: "70px",
//           boxShadow: 5,
//           borderRadius: "5px",
//           padding: "25px",
//         }}
//       >
//         <Grid
//           container
//           spacing={2}
//           sx={{ paddingTop: "25px", paddingBottom: "25px" }}
//         >
//           <Grid item xs={12} md={6}>
//             <Button
//               type="submit"
//               variant="contained"
//               sx={{
//                 paddingTop: "20px",
//                 paddingBottom: "20px",
//                 maxWidth: "250px",
//                 marginTop: "20px",
//               }}
//               fullWidth={true}
//               onClick={() => navigate("/PredictForm")}
//             >
//               <Typography component="h1" variant="h5" align="left">
//                 BACK
//               </Typography>
//             </Button>
//           </Grid>
//           <Grid item xs={12} md={6}>
//             <Button
//               type="submit"
//               variant="contained"
//               sx={{
//                 paddingTop: "20px",
//                 paddingBottom: "20px",
//                 maxWidth: "250px",
//                 marginTop: "20px",
//               }}
//               fullWidth={true}
//               onClick={() => navigate("/")}
//             >
//               <Typography component="h1" variant="h5" align="left">
//                 EXIT
//               </Typography>
//             </Button>
//           </Grid>
//         </Grid>
//       </Container>
//     </>
//   );
// }

// export default SubmitPredForm;
