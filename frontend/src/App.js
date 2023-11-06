import logo from "./logo.svg";
import "./App.css";
import Patient from "./pages/Patient";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
// pages
import ErrorPage from "./pages/error404";
import DoctorLogin from "./pages/DoctorLogin";
import DoctorRegister from "./pages/DoctorRegister";
import RecordsDashboard from "./pages/RecordsDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import Homepage from "./pages/Homepage";
import Form from "./pages/PredictForm";
import AdminDashboard from "./pages/AdminDashboard"
import SubmitPredForm from "./pages/submitPredForm"; 
import Dashboard from "./pages/fullDash"; 
import Notes from "./pages/sidemenu"; 
import NewNotes from "./pages/moderndash"; 
import AdminDashboard from "./pages/AdminDashboard";
import DoctorUpdatePassword from "./pages/DoctorUpdatePassword";

const router = createBrowserRouter([
  {
    path: "/PredictForm",
    element: <Form />,
  },
  {
    path: "/NewNotes",
    element: <NewNotes />,
  },
  {
    path: "/note",
    element: <Notes />,
  },
  {
    path: "/fullDash",
    element: <Dashboard />,
  },
  {
    path: "/submitPredForm",
    element: <SubmitPredForm />,
  },
  {
    path: "/recordsDashboard",
    element: <RecordsDashboard />,
  },
  {
    path: "/doctorLogin",
    element: <DoctorLogin />,
  },
  {
    path: "/admindashboard",
    element:<AdminDashboard />
  },
  {
    path: "/doctorRegistration",
    element: <DoctorRegister />,
  },
  {
    path: "/doctorDashboard",
    element: <DoctorDashboard />,
  },
  {
    path: "/DoctorUpdatePassword",
    element: <DoctorUpdatePassword />,
  },
  {
    path: "/",
    element: <Homepage />,
    errorElement: <ErrorPage />,
  },
]);

function App() {
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
