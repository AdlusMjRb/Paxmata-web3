import React from "react";
import * as classes from "./OverlapWrapperStyle.module.css";

export const OverlapWrapper = () => {
  return (
    <div className={classes["overlap-wrapper"]}>
      <div className={classes["created-projects-4"]}>
        <div className={classes["text-wrapper-8"]}>OPEN</div>
      </div>
      <div className={classes["overlap-2"]}>
        <div className={classes["text-wrapper-9"]}>Ongoing</div>
      </div>
      <div className={classes["overlap-3"]}>
        <div className={classes["text-wrapper-9"]}>Complete</div>
      </div>
    </div>
  );
};
export default OverlapWrapper;
