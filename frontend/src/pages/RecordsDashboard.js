import React, { useEffect,useState,useRef  } from "react";
import { useNavigate,Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getRecords } from "../redux/action"; 
import Chart from 'chart.js/auto'; 
import { format } from "date-fns";
import { Container, Row, Col, Card, Form, Select } from 'react-bootstrap';
// FYPJ\frontend\src\pages\fullDash.js
const RecordsDashboard = () => {
    const navigate = useNavigate();
    const chartInstanceRef = useRef(null); 
    const dispatch = useDispatch();
    const barChartRef  = useRef(null); // Create a ref to hold the chart element
    const lineChartRef = useRef(null);
    const chartRef = useRef(null);
    const { records } = useSelector((state) => state.data);
    const patient_id = sessionStorage.getItem('patient_id');
    console.log(patient_id);

    useEffect(() => {
        dispatch(getRecords(patient_id));
    }, []);

    useEffect(() => {
      if (!records) {
        return;
      }

      function mapPainLevelToNumeric(level) {
        switch (level.toLowerCase()) {
          case 'pain':
            return 2; // You can assign any numeric value you prefer
          case 'mild pain':
            return 1;
          case 'no pain':
            return 0;
          default:
            return null; // Handle unknown levels if needed
        }
      }

      function formatTimeFromDatetime(datetimeString) {
        const datetime = new Date(datetimeString);
        const hours = datetime.getHours().toString().padStart(2, '0');
        const minutes = datetime.getMinutes().toString().padStart(2, '0');
        const seconds = datetime.getSeconds().toString().padStart(2, '0');
      
        return `${hours}:${minutes}:${seconds}`;
      }
  
      // Extract the pain levels and count their occurrences
      const painLevels = records.map((record) => record.painlevel);
      const uniquePainLevels = [...new Set(painLevels)];
      const countByPainLevel = uniquePainLevels.map((level) => ({
        label: `${level}`,
        count: painLevels.filter((value) => value === level).length,
      }));
  
      const ctx1 = barChartRef.current.getContext('2d');
      const barChartData = {
        labels: countByPainLevel.map((item) => item.label),
        datasets: [
          {
            label: 'Count of Pain Levels',
            data: countByPainLevel.map((item) => item.count),
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
          },
        ],
      };
  
      const barChart = new Chart(ctx1, {
        type: 'bar',
        data: barChartData,
      });
      
      const ctx2 = lineChartRef.current.getContext('2d');
      const lineChartData = {
        labels: records.map((record) => formatTimeFromDatetime(record.datetime)),
        datasets: [
          {
            label: 'Pain Level Over Time',
            data: records.map((record) => mapPainLevelToNumeric(record.painlevel)),
            borderColor: 'blue',
            fill: false,
          },
        ],
      };
  
      const lineChart = new Chart(ctx2, {
        type: 'line',
        data: lineChartData,
      });



      const datetime = records.map((record) => new Date(record.datetime));
      const durations = [];
      let currentPainLevel = null;
      let transitionStartTime = null;

      for (let i = 0; i < datetime.length; i++) {
        if (painLevels[i] !== currentPainLevel) {
          if (currentPainLevel !== null) {
            const transitionDuration =
              (datetime[i] - transitionStartTime) /  (60 * 1000); // in minutes
            durations.push(transitionDuration);
          }
          currentPainLevel = painLevels[i];
          transitionStartTime = datetime[i];
        }
      }

      const ctx3 = chartRef.current.getContext('2d');
      const lineChartData1 = {
        labels: datetime.map((d) => format(d, "MM/dd/yyyy HH:mm:ss")),
        datasets: [
          {
            label: 'Pain Level Over Time',
            data: durations,
            borderColor: 'blue',
            fill: false,
          },
        ],
      };
  
      const lineChart1 = new Chart(ctx3, {
        type: 'line',
        data: lineChartData1,
      });
  
      return () => {
        barChart.destroy();
        lineChart.destroy();
        lineChart1.destroy()
      };
    }, [records]);

  
    return (
<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px',padding:'50px' }}>
  <div>
    <h2>Bar Chart - Count of Pain Levels</h2>
    <canvas id="bar" ref={barChartRef}></canvas>
  </div>
  <div>
    <h2>Line Chart - Pain Level Over Time</h2>
    <canvas id="line" ref={lineChartRef}></canvas>
  </div>
  <div>
    <h2>Line Chart - Pain Level Over Time</h2>
    <canvas id="green" ref={chartRef}></canvas>
  </div>
</div>
    )
  }
  

export default RecordsDashboard;
