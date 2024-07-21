import React, { useState } from "react";
import MilestoneList from "./MilestoneList";
import MilestoneDetails from "./MilestoneDetails";
import styles from "./Styles/MilestoneModal.module.css";

const ProjectModal = ({
  project,
  milestones,
  onClose,
  onMilestoneClick,
  selectedMilestone, // You can keep this prop if needed elsewhere in the parent component
}) => {
  const [currentMilestone, setCurrentMilestone] = useState(null);

  const handleMilestoneClick = (milestone) => {
    setCurrentMilestone(milestone);
  };

  const handleBack = () => {
    setCurrentMilestone(null);
  };

  if (!project) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        <h2>{project.projectDescription}</h2>
        {currentMilestone ? (
          <MilestoneDetails milestone={currentMilestone} onBack={handleBack} />
        ) : (
          <MilestoneList
            milestones={milestones}
            onMilestoneClick={handleMilestoneClick}
          />
        )}
      </div>
    </div>
  );
};

export default ProjectModal;
