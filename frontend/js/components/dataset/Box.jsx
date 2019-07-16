import React from "react";
import { useDrag } from "react-dnd";

const Box = ({ name }) => {
  const [{ className }, drag] = useDrag({
    item: { name, type: "column" },
    collect: monitor => ({
      className: monitor.isDragging() ? "box active" : "box",
    }),
  })
  return (
    <div ref={drag} className={className}>
      {name}
    </div>
  );
};

export default Box;
