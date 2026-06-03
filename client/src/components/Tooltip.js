import React, { useState, useRef } from 'react';

const Tooltip = ({ text, children }) => {
  const [pos, setPos] = useState(null);
  const ref = useRef(null);

  const handleMouseEnter = () => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setPos({
        top: rect.top + window.scrollY,
        left: rect.left + rect.width / 2 + window.scrollX,
      });
    }
  };

  return (
    <span
      ref={ref}
      className="tooltip-wrapper"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setPos(null)}
    >
      {children}
      {pos && (
        <span
          className="tooltip-bubble"
          style={{ position: 'absolute', top: pos.top, left: pos.left }}
        >
          {text}
        </span>
      )}
    </span>
  );
};

export default Tooltip;
