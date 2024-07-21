import React from "react";
import styles from "./Styles/ProjectComponentCard.module.css";

function ProjectComponentCard({ project, onClick, isDetail = false }) {
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

  if (!project || typeof project.id !== "string") {
    console.error("Project data is incomplete or missing:", project);
    return <div>Project data is missing or incomplete.</div>;
  }

  const {
    projectType,
    projectDescription,
    estimatedCost,
    estimatedTimescale,
    projectLocation,
    isInvestable,
    investmentGoal,
    ethereumAddress,
  } = project;

  return (
    <div className={styles.card} onClick={() => onClick(project)}>
      {" "}
      {/* Pass project */}
      <div className={styles.graphicContainer}>
        <img
          src={getProjectImage(projectType)}
          alt={`Project type: ${projectType}`}
          className={styles.graphic}
        />
      </div>
      <div className={styles.textWrapper}>
        <h3 className={styles.title}>{projectDescription}</h3>
        {isDetail && (
          <>
            <p>Estimated Cost: {estimatedCost}</p>
            <p>Timescale: {estimatedTimescale}</p>
            <p>Location: {projectLocation}</p>
            <p>Investable: {isInvestable ? "Yes" : "No"}</p>
            <p>Investment Goal: {investmentGoal}</p>
            <p>Ethereum Address: {ethereumAddress}</p>
          </>
        )}
      </div>
    </div>
  );
}

export default ProjectComponentCard;
