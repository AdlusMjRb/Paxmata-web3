import React from "react";
import * as classes from "./OverlapGroupWrapperStyle.module.css";

export const OverlapGroupWrapper = () => {
  return (
    <div className={classes["overlap-group-wrapper"]}>
      <div className={classes["created-projects-5"]}>
        <div className={classes["text-wrapper-10"]}>OPEN</div>
      </div>
      <div className={classes["rectangle-7"]} />
      <div className={classes["text-wrapper-11"]}>Ongoing</div>
      <div className={classes["rectangle-8"]} />
      <div className={classes["text-wrapper-12"]}>Draft</div>
      <div className={classes["rectangle-9"]} />
      <div className={classes["text-wrapper-13"]}>Complete</div>
      <div className={classes["investment-projects"]} />
      <div className={classes["investment-projects-2"]}>
        <div className={classes["text-wrapper-10"]}>OPEN</div>
      </div>
      <div className={classes["investment-ongoing"]} />
      <div className={classes["text-wrapper-11"]}>Ongoing</div>
      <div className={classes["investment-watchlist"]} />
      <div className={classes["text-wrapper-12"]}>Watchlist</div>
      <div className={classes["investment-complete"]} />
      <div className={classes["text-wrapper-13"]}>Complete</div>
    </div>
  );
};

export default OverlapGroupWrapper;
