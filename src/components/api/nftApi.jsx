import axios from "axios";

const BASE_URL = process.env.REACT_APP_WEB3_API_URL || "http://localhost:3003";

export const fetchProjectDetails = async (projectId) => {
  const url = `${BASE_URL}/api/projects/${projectId}`;
  console.log("Request URL:", url); // Log the URL being fetched
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching project details:", error);
    throw error;
  }
};

// Fetch all projects
export const fetchAllProjects = async () => {
  try {
    console.log("Fetching all projects");
    const response = await axios.get(`${BASE_URL}/api/projects`);
    return response.data;
  } catch (error) {
    console.error("Error fetching all projects:", error);
    throw new Error(`Failed to fetch all projects: ${error.message}`);
  }
};

// Fetch all NFTs for a specific Ethereum address
export const fetchNFTs = async (ethereumAddress) => {
  try {
    console.log(`Fetching NFTs for Ethereum address: ${ethereumAddress}`);
    const response = await axios.get(`${BASE_URL}/api/nfts/${ethereumAddress}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching NFTs:", error);
    throw new Error(`Failed to fetch NFTs: ${error.message}`);
  }
};
