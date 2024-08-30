import React, { useState } from "react";

export const ProblemInput = ({ problemType, onSolve }) => {
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSolve(input);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Render different inputs based on problemType */}
      {problemType === "Basic Operations" && (
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter an operation (e.g., 2 + 2)"
        />
      )}
      {problemType === "Simultaneous Equations" && (
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter equations separated by commas"
        />
      )}
      {/* Add more cases for other problem types */}
      <button type="submit">Solve</button>
    </form>
  );
};
