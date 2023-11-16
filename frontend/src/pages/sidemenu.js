import React, { useState, useEffect } from "react";
import PatientNav from "../components/PatientNav";
import { useNavigate } from "react-router-dom";
import DropdownFilter from "./filter";
import { useSelector, useDispatch } from "react-redux";
import { getRecords } from "../redux/action";
import { Bar, Pie } from "react-chartjs-2";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import { Grid } from "@mui/material";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import "../dash.css";
const Notes = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { records } = useSelector((state) => state.data);
  const patient_id = sessionStorage.getItem("patient_id");

  const [selectedDateRange, setSelectedDateRange] = useState("All"); // Default option
  const today = new Date().toLocaleDateString();
  const lastWeekDates = getLastWeekDates();

  useEffect(() => {
    dispatch(getRecords(patient_id));
  }, [selectedDateRange]);

  function getLastWeekDates() {
    const today = new Date();
    const lastWeekStartDate = new Date(today);
    lastWeekStartDate.setDate(today.getDate() - 8); // Subtract 7 days to get the start of last week

    const lastWeekEndDate = new Date(today);
    lastWeekEndDate.setDate(today.getDate() - 1); // Subtract 1 day to get the end of last week

    return {
      startDate: lastWeekStartDate,
      endDate: lastWeekEndDate,
    };
  }
  console.log(lastWeekDates);

  // Format the records with locale dates for filtering
  const recordsWithLocaleDates = records.map((record) => ({
    ...record,
    datetime: new Date(record.datetime).toLocaleDateString(),
  }));

  console.log("converted records", recordsWithLocaleDates);

  // Add a variable to store the filtered data based on the date range
  let filteredData = recordsWithLocaleDates;
  const uniqueDates = [
    ...new Set(recordsWithLocaleDates.map((record) => record.datetime)),
  ];
  let xValues;

  if (selectedDateRange === "Today") {
    filteredData = filteredData.filter((record) => record.datetime === today);
  } else if (selectedDateRange === "LastWeek") {
    filteredData = filteredData.filter((record) => {
      const recordDate = new Date(record.datetime);
      xValues = uniqueDates.map((date) =>
        new Date(date).toLocaleString("en-US", { weekday: "long" })
      );
      return (
        recordDate >= lastWeekDates.startDate &&
        recordDate <= lastWeekDates.endDate
      );
    });
  } else if (selectedDateRange === "All") {
    xValues = uniqueDates.map((date) =>
      new Date(date).toLocaleString("en-US", { day: "2-digit", month: "short" })
    );
  }

  // Continue with the rest of your code using the filteredData

  // Create data for the stacked bar chart
  const durationLabels = [
    ...new Set(filteredData.map((record) => record.duration)),
  ];
  const uniquePainLevels = [
    ...new Set(filteredData.map((record) => record.painlevel)),
  ];
  const uniqueActivities = [
    ...new Set(filteredData.map((record) => record.activity)),
  ];
  console.log(uniqueActivities);
  const PiePainLevels = [
    ...new Set(filteredData.filter((record) => record.painlevel === "Pain")),
  ];
  console.log("pie", PiePainLevels);

  // Define a color mapping for each painlevel
  const painLevelColors = {
    "No pain": "rgba(0, 255, 0, 0.6)", // Green
    Pain: "rgba(255, 0, 0, 0.6)", // Red
    "Mild pain": "rgba(255, 165, 0, 0.6)", // Orange
    // Add more colors and pain levels as needed
  };
  function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  let bardata;

  if (uniquePainLevels && uniqueDates && filteredData) {
    const datasets = uniquePainLevels.map((painlevel) => {
      const dataCounts = uniqueDates.map((date) => {
        const count = filteredData.filter(
          (record) => record.painlevel === painlevel && record.datetime === date
        ).length;
        return count;
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
    const dataCounts = durationLabels.map((duration) => {
      const count = filteredData.filter(
        (record) =>
          record.painlevel === painlevel && record.duration === duration
      ).length;
      return count;
    });

    return {
      label: `${painlevel}`,
      data: dataCounts,
      backgroundColor: painLevelColors[`${painlevel}`], // Use the color mapping
      borderColor: "rgba(255, 255, 255, 1)", // You can customize the border color
    };
  });

  const data = {
    labels: durationLabels,
    datasets,
  };

  const piedataset = uniqueActivities.map((activity) => {
    const count = filteredData.filter(
      (record) => record.activity === activity
    ).length;
    return count;
  });

  const piesdata = {
    labels: uniqueActivities,
    datasets: [
      {
        data: piedataset,
        backgroundColor: backgroundColors,
        borderColor: "rgba(255, 255, 255, 1)", // You can customize the border color
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: "right", // Set the legend position to 'right'
      },
    },
  };

  return (
    <>
      <PatientNav />
      <Box sx={{ width: "100%", height: "100%" }}>
        <Grid container rowSpacing={4}>
          <Grid item xs={12} md={12}>
            <Container sx={{ paddingTop: "10px" }} fixed>
              <Box />
              <Grid className="content" container spacing={2}>
                <Grid item xs={3} md={12}>
                  <div className="date-filter">
                    <select
                      class="form-select form-select-sm ms-auto d-inline-flex w-auto"
                      value={selectedDateRange}
                      onChange={(e) => setSelectedDateRange(e.target.value)}
                    >
                      <option value="All">All</option>
                      <option value="Today">Today</option>
                      <option value="LastWeek">Last Week</option>
                    </select>
                  </div>
                </Grid>
                <Grid xs={12}>
                  <Box>
                    <div class="app-card app-card-chart h-100 shadow-sm">
                      <div class="app-card-header p-3">
                        <div class="row justify-content-between align-items-center">
                          <div class="col-auto">
                            <h4 class="app-card-title">
                              Overall Pain Distribution
                            </h4>
                          </div>
                          <div class="col-auto"></div>
                        </div>
                      </div>
                      <div class="app-card-body p-3">
                        <div style={{ height: "250px" }}>
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
                                },
                              },
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </Box>
                </Grid>
                <Grid className="bar" item xs={6}>
                  <div class="app-card app-card-chart h-100 shadow-sm">
                    <div class="app-card-header p-3">
                      <div class="row justify-content-between align-items-center">
                        <div class="col-auto">
                          <h4 class="app-card-title">
                            Pain Distribution After Painkiller Taken
                          </h4>
                        </div>
                      </div>
                    </div>
                    <div class="app-card-body p-3">
                      <div style={{ height: "250px" }}>
                        <Bar
                          data={data}
                          options={{
                            maintainAspectRatio: false,
                            scales: {
                              x: {
                                stacked: true,
                              },
                              y: {
                                stacked: true,
                              },
                            },
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </Grid>
                <Grid className="pie" item xs={6}>
                  <div class="app-card app-card-chart h-100 shadow-sm">
                    <div class="app-card-header p-3">
                      <div class="row justify-content-between align-items-center">
                        <div class="col-auto">
                          <h4 class="app-card-title">
                            Distribution of Pain in Activities
                          </h4>
                        </div>
                      </div>
                    </div>
                    <div
                      class="app-card-body p-3"
                      style="display: flex; justify-content: center; align-items: center; height: 100%;"
                    >
                      <div style="width: 350px;">
                        <Pie
                          data={piesdata}
                          options={{
                            plugins: {
                              legend: {
                                position: "right", // Set the legend position to 'right'
                              },
                            },
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </Grid>
              </Grid>
            </Container>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Notes;