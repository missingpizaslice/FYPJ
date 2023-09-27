import PatientNav from "../components/PatientNav";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function DoctorDashboard() {
  const doc = localStorage.getItem("doctor_id");
  const doc_name = localStorage.getItem("doctor_name");

  console.log(doc);
  console.log(doc_name);

  return (
    <>
      <PatientNav />

      <div>welcome {localStorage.getItem("doctor_name")}</div>
    </>
  );
}
