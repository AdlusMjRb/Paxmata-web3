import React, { useState, useEffect } from "react";
import ProjectsCard from "../../src/components/Cards/ProjectCard";
import ProjectModal from "../../src/components/Modal/ProjectModal";
import styles from "./Styles/BiddingPage.module.css";

function BiddingPage() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      console.log("Fetching metadata JSON files...");

      try {
        const response = await fetch("http://localhost:3001/api/metadata");
        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.statusText}`);
        }
        const files = await response.json();

        const projectPromises = files.map(async (file) => {
          const fileResponse = await fetch(
            `http://localhost:3001/api/metadata/${file}`
          );
          if (!fileResponse.ok) {
            throw new Error(`HTTP Error: ${fileResponse.statusText}`);
          }
          return await fileResponse.json();
        });

        const projects = await Promise.all(projectPromises);
        console.log("Fetched Projects Data:", projects);
        setProjects(projects);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      }
    };

    fetchProjects();
  }, []);

  const handleProjectClick = (project) => {
    setSelectedProject(project);
  };

  const handleCloseModal = () => {
    setSelectedProject(null);
  };

  return (
    <div className={styles.biddingPageContainer}>
      <header className={styles.header}>
        <h1>PROJECT BIDDING AND INVESTMENT</h1>
      </header>
      <main className={styles.mainContent}>
        {projects.map((project) => (
          <ProjectsCard
            key={project.id}
            project={project}
            onClick={handleProjectClick}
          />
        ))}
      </main>
      {selectedProject && (
        <ProjectModal project={selectedProject} onClose={handleCloseModal} />
      )}
      <aside className={styles.sidebar}>
        <div className={styles.search}>
          <input type="text" placeholder="Search keyword" />
        </div>
        <div className={styles.filters}>
          <h3>Browse by category</h3>
          <ul>
            <li>Large scale</li>
            <li>Landscaping</li>
            <li>Property maintenance</li>
          </ul>
        </div>
      </aside>
    </div>
  );
}

export default BiddingPage;
