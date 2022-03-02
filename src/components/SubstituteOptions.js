import React from "react";

const SubstituteOptions = ({ substitutes }) => {
  const optionsMap = substitutes.map((el, i) => (
    <button key={i}>{el.name}</button>
  ));
  return <div>{optionsMap}</div>;
};

export default SubstituteOptions;
