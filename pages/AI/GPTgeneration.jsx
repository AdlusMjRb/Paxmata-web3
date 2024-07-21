import React, { useState } from "react";

const GPTgeneration = ({ onMilestonesGenerated }) => {
  const [projectDescription, setProjectDescription] = useState("");
  const [generatedMilestones, setGeneratedMilestones] = useState([]);

  const handleGenerateMilestones = async () => {
    try {
      // This function would actually call an API or similar to get data
      const milestones = await fetchMilestonesFromDescription(
        projectDescription
      );
      setGeneratedMilestones(milestones);
      onMilestonesGenerated(milestones); // Pass milestones back to the parent component
    } catch (error) {
      console.error("Failed to generate milestones:", error);
      // Handle the error appropriately in your UI
    }
  };

  const fetchMilestonesFromDescription = async (description) => {
    try {
      const response = await fetch(
        "http://localhost:3003/generate-contract-data",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ projectDescription: description }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }

      const data = await response.json();
      return data.milestonesText; // Assuming the server returns an object with a property 'milestonesText'
    } catch (error) {
      console.error("Error fetching milestones:", error);
      throw error; // Re-throw the error for handling in the calling function
    }
  };

  return (
    <div>
      <textarea
        value={projectDescription}
        onChange={(e) => setProjectDescription(e.target.value)}
        placeholder="Enter the project description here..."
        rows="4"
        cols="50"
      />
      <button onClick={handleGenerateMilestones}>Generate Contract</button>
      {generatedMilestones.map((milestone, index) => (
        <div key={index}>
          <h3>{milestone.description}</h3>
          <p>Deadline: {milestone.deadline}</p>
          <p>Payment: £{milestone.payment}</p>
        </div>
      ))}
    </div>
  );
};

export default GPTgeneration;
