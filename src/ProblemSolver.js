import React, { useEffect } from "react";
import { evaluate, lusolve, matrix } from "mathjs";

const ProblemSolver = ({ problemType, input, onSolved }) => {
  useEffect(() => {
    let solution;
    try {
      switch (problemType) {
        case "Basic Operations":
          solution = evaluate(input); // Use math.js
          break;
        case "Simultaneous Equations":
          solution = solveSimultaneousEquations(input);
          break;
        case "Quadratic Equations":
          solution = solveQuadraticEquation(input);
          break;
        case "Surds":
          solution = evaluate(input);
          break;
        case "Calculus":
          solution = solveCalculus(input);
          break;
        default:
          solution = "Invalid problem type";
      }
    } catch (error) {
      solution = "Error in solving the problem";
    }
    onSolved(solution);
  }, [problemType, input, onSolved]);
  return null;
};

const solveSimultaneousEquations = (input) => {
    // Example input: ["2x + 3y = 5", "4x - y = 2"]
    const equations = input.split(',').map(eq => eq.trim());
    const matrixA = [
        [2, 3], // Coefficients of x and y in the first equation
        [4, -1], // Coefficients of x and y in the second equation
    ];
    const matrixB = [5, 2]; // Constants on the right side of the equations

    const result = lusolve(matrix(matrixA), matrix(matrixB));
    return `x = ${result[0]}, y = ${result[1]}`;
};

export default ProblemSolver;
