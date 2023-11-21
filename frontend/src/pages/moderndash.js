import "../dash.css";
import React, { useState, useEffect } from "react";
import Chart from "chart.js/auto";
import PatientNav from "../components/PatientNav";
import { useNavigate } from "react-router-dom";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useSelector, useDispatch } from "react-redux";
import { getRecords } from "../redux/action";
import { Bar, Pie } from "react-chartjs-2";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import { Grid } from "@mui/material";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";

const NewNotes = () => {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const { records } = useSelector((state) => state.data);
    const patient_id = sessionStorage.getItem('username');
  
    const [selectedDateRange, setSelectedDateRange] = useState('All'); // Default option
    const today = new Date().toLocaleDateString();
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          // Set loading to true before dispatch
          setLoading(true);
    
          // Dispatch your action, assuming getRecords returns a Promise
          await dispatch(getRecords(patient_id, selectedDateRange));
    
          // Other logic after dispatch (optional)
        } catch (error) {
          console.error('Error fetching data:', error);
          // Handle errors if needed
        } finally {
          // Set loading to false after the dispatch is completed (whether it succeeds or fails)
          setLoading(false);
        }
      };
    
      fetchData();
    }, [selectedDateRange]);
    
    
  
  
      // Format the records with locale dates for filtering
      const recordsWithLocaleDates = records.map((record) => ({
        ...record,
        datetime: record.datetime,
      }));
  
  
    
    // Add a variable to store the filtered data based on the date range
    let filteredData = recordsWithLocaleDates;
    const uniqueDates = [...new Set(recordsWithLocaleDates.map((record) => record.datetime))];

    let xValues;

    if (selectedDateRange === 'LastWeek') {
      filteredData = filteredData.filter((record) => {
        xValues = uniqueDates.map((date) => new Date(date).toLocaleString('en-US', { weekday: 'long' }));
        return xValues;
      });
    } else if (selectedDateRange === 'LastThreeMonths') {
    
      filteredData = filteredData.filter((record) => {
        xValues = uniqueDates.map((date) => new Date(date).toLocaleString('en-US', { month: 'short' }));

    
        return xValues;
      });
    } else if (selectedDateRange === 'All') {
      xValues = uniqueDates.map((date) => new Date(date).toLocaleString('en-US', { day: '2-digit', month: 'short' }));
    }

  
    // Create data for the stacked bar chart
    const durationLabels = [...new Set(filteredData.map((record) => record.duration))];
    const uniquePainLevels = [...new Set(filteredData.map((record) => record.painlevel))];
    const uniqueActivities = [...new Set(filteredData.map((record) => record.activity))];
    const PiePainLevels = [...new Set(filteredData.filter((record) => record.painlevel === 'Pain'))];
  
    // Define a color mapping for each painlevel
    const painLevelColors = {
      'No pain': 'rgba(0, 255, 0, 0.6)', // Green
      'Pain': 'rgba(255, 0, 0, 0.6)', // Red
      'Mild pain': 'rgba(255, 165, 0, 0.6)', // Orange
      // Add more colors and pain levels as needed
    };
    function getRandomColor() {
      const letters = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    }
  
    let bardata;
    if (uniquePainLevels && uniqueDates && filteredData) {
      const datasets = uniquePainLevels.map((painlevel) => {
        const dataCounts = uniqueDates.map((date) => {
          const count = filteredData.filter((record) => record.painlevel === painlevel && record.datetime === date).length;
          const totalForDuration = filteredData.filter((record) => record.datetime === date).length;
          const percentage = ((count / totalForDuration) * 100).toFixed(2);
          return percentage;
        });
    
        return {
          label: `${painlevel}`,
          data: dataCounts,
          backgroundColor: painLevelColors[painlevel],
        };
      });
    
      bardata = {
        labels: xValues,
        datasets,
      };
    }

    
    
    
    
    
    
    const backgroundColors = uniqueActivities.map(() => getRandomColor());
  
    const datasets = uniquePainLevels.map((painlevel) => {
      const dataPercentages = durationLabels.map((duration) => {
        const count = filteredData.filter((record) => record.painlevel === painlevel && record.duration === duration).length;
        const totalForDuration = filteredData.filter((record) => record.duration === duration).length;
        const percentage = ((count / totalForDuration) * 100).toFixed(2);
        return percentage;
      });
    
      return {
        label: `${painlevel}`,
        data: dataPercentages,
        backgroundColor: painLevelColors[painlevel],
      };
    });
    
    const data = {
      labels: durationLabels,
      datasets,
    };

  
    const piedataset = uniqueActivities.map((activity) => {
      const count = filteredData.filter((record) => record.activity === activity).length;
      return count;
    });
    
    const piesdata = {
      labels: uniqueActivities,
      datasets: [
        {
          data: piedataset,
          backgroundColor: backgroundColors,
          borderColor: 'rgba(255, 255, 255, 1)', // You can customize the border color
        },
      ],
    };
    
    const options = {
      plugins: {
        legend: {
          position: 'right', // Set the legend position to 'right'
        },
      },
    };

    return (
      <>
        <PatientNav />
        <div class="app-wrapper">
          <div class="app-content pt-3 p-md-3 p-lg-4">
            <div class="container-xl">
              <div class="pb-3 pr-3">
                <FormControl className="date-filter" variant="outlined" fullWidth style={{ marginTop: "50px", maxWidth: 110 }}>
                  <Select
                    value={selectedDateRange}
                    onChange={(e) => setSelectedDateRange(e.target.value)}
                  >
                    <MenuItem value="All">All</MenuItem>
                    <MenuItem value="LastThreeMonths">Last Three Months</MenuItem>
                    <MenuItem value="LastWeek">Last Week</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <Grid className="bar g-4 mb-4" item xs={6}>
                {loading ? (
                  <div className="loader-container">
                    <h1 className='lol'>Loading ...</h1>
                    <div className="spinner"></div>
                  </div>
                ) : (
                  <>
                    <Box className='proper'>
                      <div class="app-card app-card-chart h-100 shadow-sm">
                        <div class="app-card-header p-3">
                          <div class="row justify-content-between align-items-center">
                            <div class="col-auto">
                              <h4 class="app-card-title">Overall Pain Distribution</h4>
                            </div>
                          </div>
                        </div>
                        <div class="app-card-body p-3">
                          <div style={{ height: '250px' }}>
                            <Bar
                              data={bardata}
                              options={{
                                maintainAspectRatio: false,
                                scales: {
                                  x: {
                                    stacked: true,
                                    maxBarThickness: 40,
                                  },
                                  y: {
                                    stacked: true,
                                    beginAtZero: true,
                                    max: 100,
                                  },
                                },
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </Box>
                  </>
                )}
              </Grid>
              <div class="row g-4 mb-4">
                <div class="col-12 col-lg-6">
                  <div class="app-card app-card-chart h-100 shadow-sm">
                    <div class="app-card-header p-3">
                      <div class="row justify-content-between align-items-center">
                        <div class="col-auto">
                          <h4 class="app-card-title">Pain Distribution After Painkiller Taken</h4>
                        </div>
                      </div>
                    </div>
                    <div class="app-card-body p-3">
                      <div style={{ height: '250px' }}>
                        <Bar
                          data={data}
                          options={{
                            maintainAspectRatio: false,
                            indexAxis: 'y',
                            elements: {
                              bar: {
                                borderWidth: 1,
                              },
                            },
                            responsive: true,
                            scales: {
                              x: {
                                stacked: true,
                              },
                              y: {
                                stacked: true,
                                beginAtZero: true,
                                max: 100,
                              },
                            },
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-12 col-lg-6">
                  <div class="app-card app-card-chart h-100 shadow-sm">
                    <div class="app-card-header p-3">
                      <div class="row justify-content-between align-items-center">
                        <div class="col-auto">
                          <h4 class="app-card-title">Distribution of Pain in Activities</h4>
                        </div>
                      </div>
                    </div>
                    <div class="app-card-body ">
                      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', maxHeight: '250px' }}>
                        <Pie data={piesdata} options={options} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
                        };    
    

export default NewNotes;