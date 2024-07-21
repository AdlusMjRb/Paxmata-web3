import React, { useState, useEffect } from "react";
import axios from "axios";
import ManagementCard from "../../src/components/Cards/ManagementCard";
import ProjectModal from "../../src/components/Modal/MilestoneModal"; // Ensure correct path
import styles from "./Styles/MilestoneManager.module.css";

const API_URL = "http://localhost:3003/api/projects";

const MilestoneManager = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [selectedMilestone, setSelectedMilestone] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(API_URL);
        setProjects(response.data);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      }
    };

    fetchProjects();
  }, []);

  const handleCardClick = async (project) => {
    setSelectedProject(project);
    try {
      const response = await axios.get(project.metadataUrl);
      setMilestones(response.data.milestones || []);
    } catch (error) {
      console.error("Failed to fetch milestones:", error);
      setMilestones([]);
    }
  };

  const handleCloseModal = () => {
    setSelectedProject(null);
    setMilestones([]);
    setSelectedMilestone(null);
  };

  const handleMilestoneClick = (milestone) => {
    setSelectedMilestone(milestone);
  };

  return (
    <div className={styles.milestoneManager}>
      <h2>Project Tracking</h2>
      <div className={styles.projectGrid}>
        {projects.map((project) => (
          <ManagementCard
            key={project.id}
            project={project}
            onSelect={handleCardClick}
          />
        ))}
      </div>
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          milestones={milestones}
          onClose={handleCloseModal}
          onMilestoneClick={handleMilestoneClick}
          selectedMilestone={selectedMilestone}
        />
      )}
    </div>
  );
};

export default MilestoneManager;
