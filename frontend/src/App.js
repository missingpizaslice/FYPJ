import logo from './logo.svg';
import './App.css';
import Patient from './pages/Patient';
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import ErrorPage from "./pages/error404";
import DoctorLogin from "./pages/DoctorLogin";
import DoctorRegister from './pages/DoctorRegister';


const router = createBrowserRouter([
  {
    path: "/",
    element: <Patient/>,
    errorElement: <ErrorPage />,
  },
  {
    path: "/staffaccess",
    element: <DoctorLogin />,
  },
  {
    path: "/staffregister",
    element: <DoctorRegister />,
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
