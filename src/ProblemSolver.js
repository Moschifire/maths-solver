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

// Parsing Function
const parseSimultaneousEquations = (input) => {
  const equations = input.split(",").map((eq) => eq.trim());
  const matrixA = [];
  const matrixB = [];

  equations.forEach((eq, index) => {
    // Improved regex to handle various formats and coefficients
    const regex =
      /([+-]?\d*\.?\d*)x\s*([+-]?\d*\.?\d*)y\s*=\s*([+-]?\d*\.?\d+)/i;
    const match = eq.match(regex);

    if (match) {
      let [, a, b, c] = match;

      // Handle cases where coefficient is omitted (e.g., "x" means "1x", "-x" means "-1x")
      a = a === "" || a === "+" ? "1" : a === "-" ? "-1" : a;
      b = b === "" || b === "+" ? "1" : b === "-" ? "-1" : b;

      // Parse coefficients to float
      const coefA = parseFloat(a);
      const coefB = parseFloat(b);
      const coefC = parseFloat(c);

      // Log parsed coefficients
      console.log(`Equation ${index + 1}: a=${coefA}, b=${coefB}, c=${coefC}`);

      matrixA.push([coefA, coefB]);
      matrixB.push(coefC);
    } else {
      console.error(`Equation ${index + 1} is invalid: "${eq}"`);
      throw new Error(`Invalid equation format in equation ${index + 1}`);
    }
  });

  console.log("Matrix A:", matrixA);
  console.log("Matrix B:", matrixB);

  return { matrixA, matrixB };
};

const solveSimultaneousEquations = (input) => {
  try {
    const { matrixA, matrixB } = parseSimultaneousEquations(input);

    // Convert to math.js matrix objects
    const mathMatrixA = matrix(matrixA);
    const mathMatrixB = matrix(matrixB);

    // Log the matrices being solved
    console.log("Solving Matrix A:", mathMatrixA);
    console.log("Solving Matrix B:", mathMatrixB);

    // Solve the equations
    const result = lusolve(mathMatrixA, mathMatrixB);

    // Log the raw result from lusolve
    console.log("Raw Solution:", result);

    // Extract solutions
    const solutions = result
      .toArray()
      .map((val, idx) => `x${idx + 1} = ${val[0]}`);

    // Join solutions into a string
    return solutions.join(", ");
  } catch (error) {
    console.error("Solver Error:", error);
    return "Error in solving the problem. Please check your input format.";
  }
};

// Test the function with a sample input
const input = "2x + 3y = 5, 4x - y = 2";
const solution = solveSimultaneousEquations(input);
console.log(solution); // Should output: "x = ..., y = ..."

/* const solveQuadraticEquation = (input) => {
  // Example input: "ax^2 + bx + c = 0"
  const [a, b, c] = [1, -3, 2]; // Extract coefficients from input

  const discriminant = Math.pow(b, 2) - 4 * a * c;
  if (discriminant < 0) return "No real roots";

  const root1 = (-b + Math.sqrt(discriminant)) / (2 * a);
  const root2 = (-b - Math.sqrt(discriminant)) / (2 * a);

  return `Roots are: x1 = ${root1}, x2 = ${root2}`;
}; */

export default ProblemSolver;
