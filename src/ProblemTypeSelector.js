import React from "react";

const ProblemTypeSelector = ({ onSelectType }) => {
  const problemType = [
    "Basic Operations",
    "Simultaneous Equations",
    "Quadratic Equations",
    "Simplify Surds",
    "Rationalize and Simplify Surds",
  ];
  return (
    <select onChange={(e) => onSelectType(e.target.value)}>
      {problemType.map((type) => (
        <option key={type} value={type}>
          {type}
        </option>
      ))}
    </select>
  );
};

export default ProblemTypeSelector;
