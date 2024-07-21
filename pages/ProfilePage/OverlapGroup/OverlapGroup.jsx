import React from "react";
import * as classes from "./OverlapGroupStyle.module.css";

export const OverlapGroup = () => {
  return (
    <div className={classes["overlap-group"]}>
      <div className={classes["created-projects"]}>
        <div className={classes["text-wrapper-4"]}>OPEN</div>
      </div>
      <div className={classes["rectangle"]} />
      <div className={classes["text-wrapper-5"]}>Ongoing</div>
      <div className={classes["rectangle-2"]} />
      <div className={classes["text-wrapper-6"]}>Draft</div>
      <div className={classes["rectangle-3"]} />
      <div className={classes["text-wrapper-7"]}>Complete</div>
      <div className={classes["created-projects-2"]} />
      <div className={classes["created-projects-3"]}>
        <div className={classes["text-wrapper-4"]}>OPEN</div>
      </div>
      <div className={classes["rectangle-4"]} />
      <div className={classes["text-wrapper-5"]}>Ongoing</div>
      <div className={classes["rectangle-5"]} />
      <div className={classes["text-wrapper-6"]}>Draft</div>
      <div className={classes["rectangle-6"]} />
      <div className={classes["text-wrapper-7"]}>Complete</div>
    </div>
  );
};

export default OverlapGroup;
