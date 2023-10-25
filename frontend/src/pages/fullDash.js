import React, { useState, useEffect } from "react";
import DropdownFilter from "./filter";
import { useSelector, useDispatch } from "react-redux";
import { getRecords } from "../redux/action";
import BarChart from "./pie";
import { Bar } from "react-chartjs-2";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { records } = useSelector((state) => state.data);
  const patient_id = sessionStorage.getItem('patient_id');

  // State to manage the selected date filter
  const [selectedDate, setSelectedDate] = useState('All'); // Default option

  useEffect(() => {
    dispatch(getRecords(patient_id));
  }, []);

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

  const datasets = uniquePainLevels.map((painlevel) => {
    const dataCounts = durationLabels.map((duration) => {
      const count = filteredData.filter((record) => record.painlevel === painlevel && record.duration === duration).length;
      return count;
    });

    return {
      label: `${painlevel}`,
      data: dataCounts,
      backgroundColor: `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.6)`,
      borderColor: `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 1)`,
    };
  });

  const data = {
    labels: durationLabels,
    datasets,
  };

  return (
    <>
      <div style={{ width: '1000px', height: '990px' }}>
        <DropdownFilter
          options={['All', ...uniqueDates]}
          selectedOption={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
        <div>
          <Bar
            data={data}
            options={{
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
    </>
  );
};

export default Dashboard;
