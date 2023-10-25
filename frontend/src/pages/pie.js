import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getRecords } from "../redux/action"; 
import { Bar } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";

const BarChart = ({data}) => {

  return (
    <Bar data={data} />
  );
};

export default BarChart;

