import React, { useState, useEffect } from "react";
import Link from "next/link";
import ProjectCard from "../src/components/Cards/ProjectCard.jsx";
import styles from "./Styles/ProjectViewPage.module.css";
import InvestmentModal from "../src/components/Modal/InvestmentModal.jsx";

function ProjectViewPage() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showInvestmentModal, setShowInvestmentModal] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("http://localhost:3003/api/projects");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      }
    };

    fetchProjects();
  }, []);

  const handleInvest = (projectId) => {
    console.log(`Invest in project with ID: ${projectId}`);
  };

  const handleInvestClick = (project) => {
    setSelectedProject(project);
    setShowInvestmentModal(true);
  };

  const handleInvestmentSubmit = (investmentDetails) => {
    console.log("Investment Details:", investmentDetails);
  };

  const closeModal = () => {
    setSelectedProject(null);
  };

  return (
    <div className={styles.projectViewContainer}>
      <Link href="/RFQForm" passHref>
        <button className={styles.createProjectButton}>Create a project</button>
      </Link>

      {projects.map((project) => (
        <ProjectCard
          key={project._id}
          project={project}
          onInvest={handleInvestClick}
        />
      ))}

      {showInvestmentModal && selectedProject && (
        <InvestmentModal
          project={selectedProject}
          onClose={closeModal}
          onSubmit={handleInvestmentSubmit}
        />
      )}
      {/* Side filter section */}
      <aside className={styles.filterSection}>
        {/* Search bar */}
        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="Search projects..."
            className={styles.searchInput}
          />
        </div>

        {/* Categories filter */}
        <div className={styles.filterCategories}>
          <h4>Categories</h4>
          <ul>
            <li>
              <input type="checkbox" id="category1" />
              <label htmlFor="category1">Plumbing</label>
            </li>
            <li>
              <input type="checkbox" id="category2" />
              <label htmlFor="category2">Flooring</label>
            </li>
            <li>
              <input type="checkbox" id="category1" />
              <label htmlFor="category1">Landscaping</label>
            </li>
            <input type="checkbox" id="category2" />
            <label htmlFor="category2">Electrics</label>
            {/* More categories... */}
          </ul>
        </div>
        {/* Additional filters can be added here */}
      </aside>
    </div>
  );
}

export default ProjectViewPage;
