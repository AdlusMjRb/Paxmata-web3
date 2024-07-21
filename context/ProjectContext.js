import React, { createContext, useState, useEffect } from "react";

export const ProjectContext = createContext({
  projects: [],
  setProjects: () => {},
  selectedProject: null,
  setSelectedProject: () => {},
  fetchProjects: () => {},
  updateProject: () => Promise.reject("Function not implemented"), // Placeholder function
});

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  // Function to fetch projects from the server
  const fetchProjects = async () => {
    try {
      const response = await fetch("http://localhost:3003/api/projects", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }
      const data = await response.json();
      // Convert ID to string
      const projectsWithTokenId = data.map((project) => ({
        ...project,
        id: project.id.toString(), // Ensure ID is a string
        tokenId: project.id.toString(), // Ensure tokenId is included and a string
      }));
      setProjects(projectsWithTokenId);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    }
  };

  // Function to update a project's metadata
  const updateProject = async (projectId, metadata) => {
    try {
      const response = await fetch(
        `http://localhost:3003/api/projects/${projectId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(metadata),
        }
      );
      if (!response.ok) {
        throw new Error(
          `HTTP status ${response.status}: ${await response.text()}`
        );
      }
      fetchProjects(); // Re-fetch projects to update the state with the latest data
      return await response.json();
    } catch (error) {
      console.error("Error updating project:", error);
      throw error;
    }
  };

  useEffect(() => {
    fetchProjects(); // Initial fetch of projects when the context mounts
  }, []);

  return (
    <ProjectContext.Provider
      value={{
        projects,
        setProjects,
        selectedProject,
        setSelectedProject,
        fetchProjects,
        updateProject, // Provide updateProject function
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};
