import React, { useState, useEffect } from "react";
import DropdownFilter from "./filter";
import { useSelector, useDispatch } from "react-redux";
import BarChart from "./pie";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { records } = useSelector((state) => state.data);
  console.log(records)
  const [selectedFilter, setSelectedFilter] = useState("All");
  const filterOptions = ["All", "Today"];
  const [filteredRecords, setFilteredRecords] = useState(records);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Pain Level",
        data: [],
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  });

  const updateChartData = (filteredRecords) => {
    const uniquePainLevels = [...new Set(filteredRecords.map((record) => record.painlevel))];
    const dataCounts = uniquePainLevels.map((level) =>
      filteredRecords.filter((record) => record.painlevel === level).length
    );
    console.log(uniquePainLevels)
    console.log(dataCounts)

    setChartData({
      labels: uniquePainLevels,
      datasets: [
        {
          label: "Pain Level",
          data: dataCounts,
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    });
  };

  const recordsWithLocaleDates = records.map((record) => ({
    ...record,
    datetime: new Date(record.datetime).toLocaleDateString(),
  }));

  const filterRecords = (filterValue) => {
    if (filterValue === "All") {
      setFilteredRecords(recordsWithLocaleDates);
    } else if (filterValue === "Today") {
      const today = new Date().toLocaleDateString();
      const filtered = recordsWithLocaleDates.filter((record) => {
        return record.datetime === today;
      });
      console.log(filtered)
      setFilteredRecords(filtered);
      updateChartData(filtered); // Call updateChartData after setting filteredRecords
    } else {
      // Implement other filters here
    }
  };

  useEffect(() => {
    updateChartData(filteredRecords);
  }, [filteredRecords]);

  const handleFilterChange = (event) => {
    const filterValue = event.target.value;
    setSelectedFilter(filterValue);
    filterRecords(filterValue);
  };

  return (
    <>
      <DropdownFilter filterOptions={filterOptions} selectedFilter={selectedFilter} onFilterChange={handleFilterChange} />
      <div style={{ width: "1000px", height: "1000px" }}>
        <BarChart data={chartData} />
      </div>
    </>
  );
};

export default Dashboard;