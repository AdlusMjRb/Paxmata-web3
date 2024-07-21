import React from "react";
import * as classes from "./DivWrapperStyle.module.css";

export const DivWrapper = () => {
  return (
    <div className={classes["div-wrapper"]}>
      <div className={classes["review-projects-open"]}>
        <div className={classes["text-wrapper-14"]}>OPEN</div>
      </div>
      <div className={classes["overlap-4"]}>
        <div className={classes["text-wrapper-15"]}>Reviewed</div>
      </div>
      <div className={classes["overlap-5"]}>
        <div className={classes["text-wrapper-15"]}>Draft</div>
      </div>
    </div>
  );
};

export default DivWrapper;
