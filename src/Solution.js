import React from "react";

const Solution = ({ solution }) => {
  return <div>{solution !== null && <h3>Solution: {solution}</h3>}</div>;
};

export default Solution;
