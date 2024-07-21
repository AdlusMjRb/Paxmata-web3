// src/components/ProjectComponent.js
import React, { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { ProjectContext } from "../../context/ProjectContext";
import ConnectWalletButton from "../../src/components/Buttons/ConnectWalletButton";
import ProjectComponentCard from "../../src/components/Cards/ProjectComponentCard";
import styles from "./Styles/ProjectComponent.module.css";

const ProjectComponent = () => {
  const { user, setUser } = useContext(UserContext);
  const { projects, selectedProject, setSelectedProject, fetchProjects } =
    useContext(ProjectContext);

  // Function to handle project selection
  const handleSelectProject = (project) => {
    if (!project || typeof project.id !== "string") {
      console.error("Invalid project ID:", project);
      return;
    }
    if (selectedProject?.id !== project.id) {
      setSelectedProject(project);
    }
  };

  // Function to handle going back to the project list
  const handleBackToProjects = () => {
    setSelectedProject(null);
  };

  // Fetch projects when user is logged in
  React.useEffect(() => {
    if (user?.ethereumAddress) {
      fetchProjects();
    }
  }, [user, fetchProjects]);

  if (!user || !user.ethereumAddress) {
    return (
      <div className={styles.projectWrapper}>
        <ConnectWalletButton setUser={setUser} />
      </div>
    );
  }

  return (
    <div className={styles.projectWrapper}>
      {selectedProject ? (
        <ProjectComponentCard
          project={selectedProject}
          onClick={handleBackToProjects}
          isDetail={true}
        />
      ) : (
        <div className={styles.projectList}>
          {projects.map((project) => (
            <div key={project.id} className={styles.projectCardContainer}>
              <ProjectComponentCard
                project={project}
                onClick={() => handleSelectProject(project)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectComponent;
