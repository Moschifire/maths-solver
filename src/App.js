import { useState } from "react";
import "./App.css";
import ProblemTypeSelector from "./ProblemTypeSelector";
import { ProblemInput } from "./ProblemInput";
import ProblemSolver from "./ProblemSolver";

function App() {
  const [problemType, setProblemType] = useState("Basic Operations");
  const [input, setInput] = useState("");
  const [solution, setSolution] = useState(null);

  return (
    <div className="App">
      <h1>Maths Solver</h1>
      <ProblemTypeSelector onSelectType={setProblemType} />
      <ProblemInput problemType={problemType} onSolve={setInput} />
      <ProblemSolver problemType={problemType} input={input} onSolved={setSolution} />
    </div>
  );
}

export default App;
