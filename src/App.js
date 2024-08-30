import { useState } from "react";
import "./App.css";
import ProblemTypeSelector from "./ProblemTypeSelector";
import { ProblemInput } from "./ProblemInput";

function App() {
  const [problemType, setProblemType] = useState("Basic Operations");
  const [input, setInput] = useState("");
  return (
    <div className="App">
      <h1>Maths Solver</h1>
      <ProblemTypeSelector onSelectType={setProblemType} />
      <ProblemInput problemType={problemType} onSolve={setInput} />
    </div>
  );
}

export default App;
