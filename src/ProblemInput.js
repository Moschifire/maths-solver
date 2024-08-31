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
          style={{ width: "300px", height: "auto" }}
          rows="2"
          cols="30"
          placeholder="Enter equations separated by commas (e.g., 2x+y=4, 2x+4y=8)"
        />
      )}
      {problemType === "Quadratic Equations" && (
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ width: "300px", height: "auto" }}
          rows="2"
          cols="30"
          placeholder="Enter a quadratic equation (e.g., 2x^2-4x-6=0)"
        />
      )}
      {problemType === "Surds" && (
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ width: "300px", height: "auto" }}
          rows="2"
          cols="30"
          placeholder="Enter surd expression (e.g., 2√16 or 2√4 + 3√4)"
        />
      )}
      {/* Add more cases for other problem types */}
      <button type="submit">Solve</button>
    </form>
  );
};
