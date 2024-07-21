import React from "react";
import styles from "./Styles/ManagementCard.module.css";

function ManagementCard({ project, onSelect }) {
  const getProjectImage = (type) => {
    switch (type) {
      case "housing":
        return "/images/NFT_House.png";
      case "landscaping":
        return "/images/NFT_Landscaping.png";
      case "maintenance":
        return "/images/NFT_Maintenance.png";
      default:
        return "/images/default.png";
    }
  };

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

  const handleClick = () => {
    onSelect(project);
  };

  if (!project) {
    return null;
  }

  // Check for milestones and calculate progress
  const milestones = project.milestones || [];
  const completedMilestones = milestones.filter(
    (milestone) => milestone.status === "completed"
  ).length;
  const totalMilestones = milestones.length;
  const progress =
    totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 50; // Dummy progress if no milestones

  return (
    <div className={styles.cardWrapper} onClick={handleClick}>
      <div className={styles.card}>
        <div className={styles.graphicContainer}>
          <img
            src={getProjectImage(project.projectType)}
            alt={`Project type: ${project.projectType}`}
            className={styles.graphic}
          />
          <div className={styles.textOverlay}>
            <h3 className={styles.title}>
              {project.projectDescription || "Project Description"}
            </h3>
          </div>
        </div>
        <div className={styles.content}>
          <div className={styles.badgeContainer}>
            {getBadgeImages(project.badges).map((badge, index) => (
              <div key={index} className={styles.badgeWrapper}>
                <img src={badge.src} alt="Badge" className={styles.badgeIcon} />
              </div>
            ))}
          </div>
          {project.isInvestable && (
            <div className={styles.investableBadgeWrapper}>
              <span className={styles.investableBadge}>Investable</span>
            </div>
          )}
          <div className={styles.description}>
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
            <div className={styles.progress}>
              <p>
                <strong>Progress:</strong> ({progress.toFixed(2)}%)
              </p>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressBarFill}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManagementCard;
