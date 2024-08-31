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
        case "Simplify Surds":
          solution = simplifySurds(input);
          break;
        case "Rationalize and Simplify Surds":
          solution = rationalizeAndSimplify(input);
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

// Simplify Surds
const simplifySurds = (input) => {
  // Split the expression into parts by "+" and "-"
  const parts = input.split(/(?=[+-])/);

  // Object to store the sum of like surds
  const surdTerms = {};

  parts.forEach((part) => {
    // Extract the coefficient and radicand
    const match = part.match(/([+-]?\d*)√(\d+)/);
    if (match) {
      let coefficient = match[1]
        ? parseInt(match[1])
        : match[0][0] === "-"
        ? -1
        : 1;
      const radicand = parseInt(match[2]);

      // Simplify the radicand
      const [simplifiedCoefficient, simplifiedRadicand] =
        simplifyRadicand(radicand);

      // Combine coefficients of like surds
      const key = `√${simplifiedRadicand}`;
      surdTerms[key] =
        (surdTerms[key] || 0) + coefficient * simplifiedCoefficient;
    }
  });

  // Construct the simplified expression
  const result = Object.entries(surdTerms)
    .map(([key, value]) =>
      value === 1 ? key : value === -1 ? `-${key}` : `${value}${key}`
    )
    .join(" + ")
    .replace(/\+ -/g, "- ");

  return result || "0"; // If result is empty, return '0'
};

const simplifyRadicand = (n) => {
  // Find the largest perfect square factor of n
  for (let i = Math.floor(Math.sqrt(n)); i > 1; i--) {
    if (n % (i * i) === 0) {
      return [i, n / (i * i)];
    }
  }
  return [1, n]; // If no simplification is possible
};

const rationalizeSurd = (input) => {
  // Step 1: Match and parse the numerator and denominator
  const match = input.match(/(\d*√?\d*)\/(\(?.*\)?)/);
  if (!match) return input; // If no match, return the expression as-is

  let numerator = match[1] || "1";
  const denominator = match[2].replace(/[()]/g, ""); // Remove parentheses if any

  // Step 2: Check if the denominator is a simple surd or a binomial expression
  const simpleSurdMatch = denominator.match(/^√(\d+)$/);
  const complexSurdMatch = denominator.match(/^(√\d+)([+-])(√\d+)$/);

  if (simpleSurdMatch) {
    // Case 1: Denominator is a simple surd (e.g., 1/√2)
    const radicand = parseInt(simpleSurdMatch[1]);
    const newNumerator = `${numerator}√${radicand}`;
    const newDenominator = radicand;
    return `${newNumerator}/${newDenominator}`;
  } else if (complexSurdMatch) {
    // Case 2: Denominator is a binomial surd expression (e.g., 1/(√2 + √3))
    const [_, firstTerm, operator, secondTerm] = complexSurdMatch;
    const conjugate =
      operator === "+"
        ? `${firstTerm}-${secondTerm}`
        : `${firstTerm}+${secondTerm}`;

    // Multiply numerator by the conjugate
    const newNumerator = `${numerator}(${conjugate})`;

    // Use difference of squares to simplify denominator
    const firstRadicand = parseInt(firstTerm.match(/\d+/)[0]);
    const secondRadicand = parseInt(secondTerm.match(/\d+/)[0]);
    const newDenominator = firstRadicand - secondRadicand;

    return `${newNumerator}/${newDenominator}`;
  }

  // Step 3: Handle more complex cases or return original if not handled
  return input;
};

// Utility function to simplify a term like "2√2 + 3√2"
const simplifyExpression = (input) => {
  const parts = input.split(/(?=[+-])/);
  const termMap = {};

  parts.forEach((part) => {
    const match = part.match(/([+-]?\d*)√(\d+)/);
    if (match) {
      const coefficient = match[1]
        ? parseInt(match[1])
        : part[0] === "-"
        ? -1
        : 1;
      const radicand = parseInt(match[2]);

      termMap[radicand] = (termMap[radicand] || 0) + coefficient;
    } else {
      termMap["constant"] = (termMap["constant"] || 0) + parseInt(part);
    }
  });

  return Object.entries(termMap)
    .map(([key, value]) =>
      key === "constant"
        ? value
        : `${value > 1 || value < -1 ? value : ""}√${key}`
    )
    .join(" + ")
    .replace(/\+ -/g, "- ");
};

// Rationalize and simplify a complex expression
const rationalizeAndSimplify = (input) => {
  const rationalized = rationalizeSurd(input);
  return simplifyExpression(rationalized);
};

export default ProblemSolver;
