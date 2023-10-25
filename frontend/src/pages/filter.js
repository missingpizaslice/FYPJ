// DropdownFilter.js
import React from "react";

const DropdownFilter = ({ options, selectedOption, onChange }) => {
  return (
    <div>
      <label htmlFor="filterDropdown">Select Filter:</label>
      <select id="filterDropdown" value={selectedOption} onChange={onChange}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DropdownFilter;

