// src/components/Modal/ProjectModal.jsx

import React from "react";
import styles from "./Styles/ProjectModal.module.css";

function ProjectModal({ project, onClose }) {
  if (!project) return null;

  const badgeDescriptions = {
    sustainability:
      "Projects utilizing green technologies or sustainable practices.",
    community_impact:
      "Developments delivering significant benefits to local communities.",
    medical_infrastructure:
      "Projects focused on building or renovating medical facilities.",
    heritage_preservation:
      "Efforts focused on restoring and preserving historical sites.",
    charitable_donation: "Projects funded through donations.",
  };

  const getBadgeImages = (badges = []) => {
    const badgeMap = {
      sustainability: "/images/sustainability.png",
      community_impact: "/images/community_impact.png",
      medical_infrastructure: "/images/medical_infrastructure.png",
      heritage_preservation: "/images/heritage_preservation.png",
      charitable_donation: "/images/charitable_donation.png",
    };
    return badges.map((badge) => ({
      src: badgeMap[badge],
      description: badgeDescriptions[badge],
    }));
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        <div className={styles.modalHeader}>
          <h2>{project.projectDescription}</h2>
        </div>
        <div className={styles.modalBody}>
          <img
            src={`/images/NFT_${
              project.projectType.charAt(0).toUpperCase() +
              project.projectType.slice(1)
            }.png`}
            alt={project.projectType}
            className={styles.projectImage}
          />
          <div className={styles.details}>
            <p>
              <strong>Cost:</strong> £{project.estimatedCost || "0"}
            </p>
            <p>
              <strong>Timescale:</strong>{" "}
              {project.estimatedTimescale || "Not specified"}
            </p>
            <p>
              <strong>Location:</strong>{" "}
              {project.projectLocation || "Not specified"}
            </p>
            {project.isInvestable && (
              <p>
                <strong>Goal:</strong> £
                {project.investmentGoal || "Not specified"}
              </p>
            )}
          </div>
          <div className={styles.badgeContainer}>
            {getBadgeImages(project.badges).map((badge, index) => (
              <div key={index} className={styles.badgeWrapper}>
                <img src={badge.src} alt="Badge" className={styles.badgeIcon} />
                <p>{badge.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectModal;
