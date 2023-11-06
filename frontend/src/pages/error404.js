// just leave this be
import { useRouteError } from "react-router-dom";

import PatientNav from "../components/PatientNav";
import { Container } from "@mui/system";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div id="error-page">
      <PatientNav />

      <Container sx={{ marginTop: "130px" }}>
        <h1>Oops!</h1>
        <p>Sorry, an unexpected error has occurred.</p>
        <p>
          <i>{error.statusText || error.message}</i>
        </p>
      </Container>
    </div>
  );
}
