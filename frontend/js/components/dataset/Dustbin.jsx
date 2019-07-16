import React from "react";
import { useDrop } from "react-dnd";

const Dustbin = ({ name, onDrop, children }) => {
  const [{ canDrop, isOver }, drop] = useDrop({
    accept: "column",
    drop: onDrop,
    collect: monitor => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });
  const isActive = canDrop && isOver;

  let className = "dustbin";
  if (isActive) {
    className += " active";
  }
  else if (canDrop) {
    className += " can_drop";
  }

  return (
    <div ref={drop} className={className}>
      <p className="title">{name}</p>
      <div className="boxes">
        {children}
      </div>
    </div>
  );
};

export default Dustbin;
