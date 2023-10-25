// DropdownFilter.js
import React from "react";
import {Select,MenuItem} from '@mui/material';

const DropdownFilter = ({ filterOptions, selectedFilter, onFilterChange }) => {
  return (
    <Select value={selectedFilter} onChange={onFilterChange}>
      {filterOptions.map((option, index) => (
        <MenuItem key={index} value={option}>
          {option}
        </MenuItem>
      ))}
    </Select>
  );
};

export default DropdownFilter;
