import PatientNav from "../components/PatientNav";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function DoctorDashboard() {
  // const doctor = useSelector((state) => state.data.doctor);
  // var cookie = document.cookie;
  // var doctor_data = JSON.parse(cookie);

  var cookie = "";
  var doctor_data = "";
  const navigate = useNavigate();

  useEffect(() => {
    if (!document.cookie) {
      navigate("/doctorLogin");
    } else {
      cookie = document.cookie;
      doctor_data = JSON.parse(cookie);
      console.log(doctor_data);
    }
  }, []);

  return (
    <>
      <PatientNav />

      <div>welcome {doctor_data["id"]}</div>
    </>
  );
}
