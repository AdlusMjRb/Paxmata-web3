import React from "react";
import styles from "./Styles/Tooltip.module.css";

function Tooltip({ text, visible, position }) {
  return (
    <div
      className={`${styles.tooltip} ${visible ? styles.visible : ""}`}
      style={{ top: position.y, left: position.x }}
    >
      {text}
    </div>
  );
}

export default Tooltip;
