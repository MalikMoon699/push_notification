import React from "react";
import { Spiral } from "ldrs/react";
import "ldrs/react/Spiral.css";

const Loader = ({
  size = "40",
  className = "loaderWrapper",
  color = "var(--primary)",
  speed = "1.75",
  stroke = "5",
  height = "100%",
  width = "100%",
  style = {},
}) => {
  return (
    <div className={className} style={{ height, width, ...style }}>
      <Spiral size={size} speed={speed} stroke={stroke} color={color} />
    </div>
  );
};

export default Loader;