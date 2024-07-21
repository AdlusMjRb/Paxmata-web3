import React from "react";
import styles from "./Styles/MilestoneList.module.css";

const MilestoneList = ({ milestones, onMilestoneClick }) => {
  return (
    <div className={styles.timeline}>
      {milestones.map((milestone) => (
        <div
          key={milestone.id}
          className={styles.milestoneBox}
          onClick={() => onMilestoneClick(milestone)}
        >
          <p>Milestone {milestone.id + 1}</p>
          <div className={styles.progress}>
            <div
              className={styles.progressBar}
              style={{ width: `${milestone.progress}%` }}
            ></div>
          </div>
          <p className={styles.progressText}>{milestone.progress}%</p>
        </div>
      ))}
    </div>
  );
};

export default MilestoneList;
