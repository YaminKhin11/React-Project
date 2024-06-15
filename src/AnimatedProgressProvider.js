import React from "react";
import { Animate } from "react-move";
import { easeQuadInOut } from "d3-ease";

const AnimatedProgressProvider = ({
  valueStart,
  valueEnd,
  duration,
  easingFunction,
  repeat,
  children,
}) => (
  <Animate
    start={() => ({ value: valueStart })}
    update={() => ({
      value: [valueEnd],
      timing: { duration: duration * 1000, ease: easingFunction },
    })}
  >
    {({ value }) => children(value)}
  </Animate>
);

export default AnimatedProgressProvider;
