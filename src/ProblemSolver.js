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
        case "Simplify Single Surd":
          solution = simplifySingleSurd(input);
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

// Simultaneous Equation Solver
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

      matrixA.push([coefA, coefB]);
      matrixB.push(coefC);
    } else {
      console.error(`Equation ${index + 1} is invalid: "${eq}"`);
      throw new Error(`Invalid equation format in equation ${index + 1}`);
    }
  });

  return { matrixA, matrixB };
};

const solveSimultaneousEquations = (input) => {
  try {
    const { matrixA, matrixB } = parseSimultaneousEquations(input);

    // Convert to math.js matrix objects
    const mathMatrixA = matrix(matrixA);
    const mathMatrixB = matrix(matrixB);

    // Solve the equations
    const result = lusolve(mathMatrixA, mathMatrixB);

    // Extract solutions
    const solutions = result
      .toArray()
      .map((val, idx) => `x${idx + 1} = ${val[0]}`);

    // Join solutions into a string
    return solutions.join(", ");
  } catch (error) {
    return "Error in solving the problem. Please check your input format.";
  }
};

// Quadratic Equation solver
const parseQuadraticEquation = (input) => {
  const match = input.match(
    /([+-]?\d*)x\^2\s*([+-]?\d*)x\s*([+-]?\d*)\s*=\s*0/
  );

  if (match) {
    const [, a, b, c] = match;
    return {
      a: parseFloat(a || 1),
      b: parseFloat(b || 0),
      c: parseFloat(c || 0),
    };
  }

  throw new Error("Invalid quadratic equation format");
};

const solveQuadraticEquation = (input) => {
  const { a, b, c } = parseQuadraticEquation(input);

  const discriminant = Math.pow(b, 2) - 4 * a * c;
  if (discriminant < 0) return "No real roots";

  const root1 = (-b + Math.sqrt(discriminant)) / (2 * a);
  const root2 = (-b - Math.sqrt(discriminant)) / (2 * a);

  return `Roots are: x1 = ${root1}, x2 = ${root2}`;
};

// Simplify Single Surd
const simplifySingleSurd = (input) => {
  // Parsing and simplification logic goes here
  // For simplicity, let's assume the expression is in a very basic form
  // like "2√8 + √18 - √2"

  const parts = input.split(/(?=\+|\-)/); // Split by "+" or "-" while keeping them in the array

  const simplifiedParts = parts.map((part) => {
    // Extract the coefficient and radicand
    const match = part.match(/(-?\d*)√(\d+)/);
    if (match) {
      let coefficient = match[1] ? parseInt(match[1]) : 1;
      const radicand = parseInt(match[2]);

      // Simplify the radicand (for example, √8 = 2√2)
      const [simplifiedCoefficient, simplifiedRadicand] =
        simplifyRadicand(radicand);

      // Combine the original coefficient with the simplified coefficient
      coefficient *= simplifiedCoefficient;

      // Return the simplified surd
      if (simplifiedRadicand === 1) {
        return `${coefficient}`;
      }
      return `${coefficient}√${simplifiedRadicand}`;
    }

    // If part is not a surd, return it unchanged
    return part;
  });

  // Combine simplified parts back into a string
  return simplifiedParts.join(" ");
};

// Function to simplify the radicand
function simplifyRadicand(n) {
  // Find the largest perfect square factor of n
  for (let i = Math.floor(Math.sqrt(n)); i > 1; i--) {
    if (n % (i * i) === 0) {
      return [i, n / (i * i)];
    }
  }
  return [1, n]; // If no simplification is possible
}

export default ProblemSolver;
