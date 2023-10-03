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

const router = createBrowserRouter([
  {
    path: "/",
    element: <Patient />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/doctorLogin",
    element: <DoctorLogin />,
  },
  {
    path: "/doctorRegistration",
    element: <DoctorRegister />,
  },
  {
    path: "/doctorDashboard",
    element: <DoctorDashboard />,
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
