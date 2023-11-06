import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DropdownFilter from "./filter";
import { useSelector, useDispatch } from "react-redux";
import { getRecords } from "../redux/action";
import { Bar,Pie } from "react-chartjs-2";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputAdornment from '@mui/material/InputAdornment';
import EventIcon from '@mui/icons-material/Event';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Grid } from "@mui/material";
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { records } = useSelector((state) => state.data);
  const patient_id = sessionStorage.getItem('patient_id');

  // State to manage the selected date filter
  const [selectedDate, setSelectedDate] = useState('All'); // Default option

  useEffect(() => {
    dispatch(getRecords(patient_id));
  }, []);

  function getLastWeekDates() {
    const today = new Date();
    const lastWeekStartDate = new Date(today);
    lastWeekStartDate.setDate(today.getDate() - 7); // Subtract 7 days to get the start of last week
  
    const lastWeekEndDate = new Date(today);
    lastWeekEndDate.setDate(today.getDate() - 1); // Subtract 1 day to get the end of last week
  
    return {
      startDate: lastWeekStartDate,
      endDate: lastWeekEndDate,
    };
  }
  
  // Example usage:
  const lastWeekDates = getLastWeekDates();
  console.log(lastWeekDates)

  // Format the records with locale dates for filtering
  const recordsWithLocaleDates = records.map((record) => ({
    ...record,
    datetime: new Date(record.datetime).toLocaleDateString(),
  }));

  const uniqueDates = [...new Set(recordsWithLocaleDates.map((record) => record.datetime))];

  // Filter the data based on the selected date
  const filteredData = selectedDate === 'All'
    ? recordsWithLocaleDates // Show all data
    : recordsWithLocaleDates.filter((item) => item.datetime === selectedDate);

  // Create data for the stacked bar chart
  const durationLabels = [...new Set(filteredData.map((record) => record.duration))];
  const uniquePainLevels = [...new Set(filteredData.map((record) => record.painlevel))];

  // Define a color mapping for each painlevel
  const painLevelColors = {
    'No pain': 'rgba(0, 255, 0, 0.6)', // Green
    'Pain': 'rgba(255, 0, 0, 0.6)', // Red
    'Mild pain': 'rgba(255, 165, 0, 0.6)', // Orange
    // Add more colors and pain levels as needed
  };

  const datasets = uniquePainLevels.map((painlevel) => {
    const dataCounts = durationLabels.map((duration) => {
      const count = filteredData.filter((record) => record.painlevel === painlevel && record.duration === duration).length;
      return count;
    });

    return {
      label: `${painlevel}`,
      data: dataCounts,
      backgroundColor: painLevelColors[`${painlevel}`], // Use the color mapping
      borderColor: 'rgba(255, 255, 255, 1)', // You can customize the border color
    };
  });

  const data = {
    labels: durationLabels,
    datasets,
  };

  const piedata = {
    labels: [
      'Red',
      'Blue',
      'Yellow'
    ],
    datasets: [{
      label: 'My First Dataset',
      data: [300, 50, 100],
      backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(255, 205, 86)'
      ],
      hoverOffset: 4
    }]
  };

  const edata = {
    labels: [
      'Jan',
      'Blue',
      'Yellow',
      'Jan',
      'Blue',
      'Yellow',
      'Jan',
      'Blue',
      'Yellow',
    ],
    datasets: [{
      label: 'My First Dataset',
      data: [300, 50, 100,300, 50, 100,300, 50, 100],
      backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(255, 205, 86)'
      ],
      hoverOffset: 4
    }]
  };

  return (
    <>
        <Box sx={{ width: '100%',height:'100%' }}>
      <Grid container rowSpacing={1}>
        <Grid className="side-menu" item xs={6} md={2}>
        <CardActions>
                          <Button
                          size="medium"
                          variant="contained"
                          sx={{
                            height: "35px",
                          }}
                          onClick={() => {
                            navigate("/")}
                          }
                        >
                          Logout
                        </Button>
                          </CardActions>
        </Grid>
        <Grid item xs={6} md={10}>
        <Container sx={{ paddingTop: '10px' }} fixed>
        <Box />
        <Grid className="content" container spacing={2}>
        <Grid item xs={3}> 
  <FormControl className="date-filter" variant="outlined" fullWidth>
    <InputLabel htmlFor="date-filter">Select Date</InputLabel>
    <Select
      id="date-filter"
      value={selectedDate}
      onChange={(e) => setSelectedDate(e.target.value)}
      label="Select Date"
    >
      <MenuItem value="All">All Dates</MenuItem>
      {uniqueDates.map((date) => (
        <MenuItem key={date} value={date}>{date}</MenuItem>
      ))}
    </Select>
  </FormControl>
</Grid>
  <Grid item xs={12}>
    <Box>
    <div style={{ height: '250px' }}>
  <Bar
    data={edata}
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

          </Box>
  </Grid>
  <Grid className="pie" item xs={6}>
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
  </Grid>
  <Grid className="pie" item xs={6}>
  <Pie data={piedata} />
  </Grid>
</Grid>
        </Container>
        </Grid>
        </Grid>
        </Box>
    </>
  );
};

export default Dashboard;