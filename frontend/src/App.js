import logo from "./logo.svg";
import "./App.css";
import Patient from "./pages/Patient";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
// pages
import ErrorPage from "./pages/error404";
import DoctorLogin from "./pages/DoctorLogin";
import DoctorRegister from "./pages/DoctorRegister";
import DoctorDashboard from "./pages/DoctorDashboard";
import Homepage from "./pages/Homepage";
import AdminDashboard from "./pages/AdminDashboard";
import DoctorUpdatePassword from "./pages/DoctorUpdatePassword";

const router = createBrowserRouter([
  {
    path: "/patient",
    element: <Patient />,
  },
  {
    path: "/doctorLogin",
    element: <DoctorLogin />,
  },
  {
    path: "/admindashboard",
    element: <AdminDashboard />,
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
