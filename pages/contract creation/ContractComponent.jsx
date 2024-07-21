import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import classes from "./Styles/ContractComponent.module.css";
import { ProjectContext } from "../../context/ProjectContext";

const MilestoneItem = ({
  milestone,
  index,
  handleMilestoneChange,
  handleRemoveMilestone,
  handleFileUpload,
}) => (
  <div key={index} className={classes["milestone-item"]}>
    <input
      type="text"
      value={milestone.title || ""}
      onChange={(e) => handleMilestoneChange(index, "title", e.target.value)}
      placeholder="Title"
      className={classes["input-project-info"]}
    />
    <textarea
      value={milestone.description || ""}
      onChange={(e) =>
        handleMilestoneChange(index, "description", e.target.value)
      }
      placeholder="Description"
      className={classes["input-project-info"]}
    />
    <input
      type="date"
      value={milestone.deadline || ""}
      onChange={(e) => handleMilestoneChange(index, "deadline", e.target.value)}
      placeholder="Deadline"
      className={classes["input-project-info"]}
    />
    <input
      type="text"
      value={milestone.paymentDetails || ""}
      onChange={(e) =>
        handleMilestoneChange(index, "paymentDetails", e.target.value)
      }
      placeholder="Payment Details"
      className={classes["input-project-info"]}
    />
    <input
      type="file"
      onChange={(e) => handleFileUpload(index, e.target.files[0])}
      className={classes["input-project-info"]}
    />
    {milestone.evidenceUrl && (
      <a
        href={milestone.evidenceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={classes["evidence-link"]}
      >
        View Uploaded Evidence
      </a>
    )}
    <div className={classes["button-group"]}>
      <button
        onClick={() => handleRemoveMilestone(index)}
        className={classes["remove-button"]}
      >
        Remove Milestone
      </button>
    </div>
  </div>
);

const ContractComponent = () => {
  const { selectedProject } = useContext(ProjectContext);
  const [milestones, setMilestones] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [paymentDetails, setPaymentDetails] = useState("");
  const [evidenceFile, setEvidenceFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (selectedProject) {
      setDescription(selectedProject.projectDescription || "");
      fetchMilestones(selectedProject.id); // Fetch existing milestones if project is selected
    }
  }, [selectedProject]);

  const fetchMilestones = async (projectId) => {
    try {
      const response = await axios.get(
        `http://localhost:3003/api/milestones/${projectId}`
      );
      setMilestones(response.data.milestones || []);
    } catch (error) {
      console.error("Error fetching milestones:", error);
    }
  };

  const handleAddMilestone = () => {
    if (!title) {
      alert("Milestone title is required.");
      return;
    }

    const newMilestone = {
      title,
      description,
      deadline,
      paymentDetails,
      evidenceUrl: "",
    };

    setMilestones((prev) => [...prev, newMilestone]);
    resetMilestoneInputs();
  };

  const resetMilestoneInputs = () => {
    setTitle("");
    setDescription(selectedProject.projectDescription || ""); // Preserve project description
    setDeadline("");
    setPaymentDetails("");
    setEvidenceFile(null);
  };

  const handleMilestoneChange = (index, field, value) => {
    const updatedMilestones = milestones.map((milestone, i) => {
      if (i === index) {
        return { ...milestone, [field]: value };
      }
      return milestone;
    });
    setMilestones(updatedMilestones);
  };

  const handleFileUpload = async (index, file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await axios.post(
        "http://localhost:3003/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      const fileUrl = response.data.fileUrl;
      handleMilestoneChange(index, "evidenceUrl", fileUrl);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload file. Please try again.");
    }
  };

  const handleRemoveMilestone = (index) => {
    setMilestones((prev) => prev.filter((_, i) => i !== index));
  };

  const fetchGeneratedMilestones = async () => {
    if (!selectedProject || !selectedProject.projectDescription) {
      alert("Selected project does not have a description.");
      return;
    }

    try {
      setLoading(true);
      setNotification("Generating milestones...");

      const response = await axios.post(
        "http://localhost:3002/generate-detailed-plan", // Corrected endpoint
        {
          projectDescription: selectedProject.projectDescription,
        }
      );

      if (!response.data.success || !response.data.detailedPlan) {
        throw new Error("Invalid response format from AI server.");
      }

      const parsedMilestones = parseJSONData(response.data.detailedPlan);
      setMilestones(parsedMilestones);
      setLoading(false);
      setNotification("Milestones generated successfully!");
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.error("Error fetching milestones:", error);
      alert(
        "Failed to fetch milestones. Please check the file path or API endpoint."
      );
      setLoading(false);
      setNotification("Failed to generate milestones.");
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const parseJSONData = (data) => {
    return data.map((milestone, index) => ({
      id: milestone.number || index,
      title: milestone.title || "",
      description: milestone.description || "",
      deadline: milestone.deadline || "",
      paymentDetails: milestone.paymentDetails || "",
      evidenceUrl: milestone.evidenceUrl || "",
    }));
  };

  const updateProjectMetadata = async () => {
    if (!selectedProject || !selectedProject.id) {
      alert("Please select a project to update metadata for.");
      return;
    }

    try {
      setLoading(true);
      setNotification("Generating contract and uploading milestones...");

      // Log milestones before sending
      console.log("Sending milestones to backend:", milestones);

      // Convert milestones for backend
      const descriptions = milestones.map((m) => m.title);
      const deadlines = milestones.map((m) =>
        m.deadline ? Math.floor(new Date(m.deadline).getTime() / 1000) : 0
      );
      const evidenceUrls = milestones.map((m) => m.evidenceUrl);

      // Send milestones to blockchain
      const response = await axios.post(
        "http://localhost:3003/api/milestones/add",
        {
          descriptions,
          deadlines,
          evidenceUrls,
        }
      );

      if (response.data.success) {
        // Update metadata with new milestones
        const updateResponse = await axios.post(
          "http://localhost:3003/api/update-metadata",
          {
            tokenId: selectedProject.id,
            milestones,
          }
        );

        if (updateResponse.data && updateResponse.data.message) {
          setNotification(updateResponse.data.message);
        } else {
          setNotification("Metadata and milestones updated successfully!");
        }

        setTimeout(() => setNotification(null), 3000);
      } else {
        alert("Failed to upload milestones");
      }
    } catch (error) {
      console.error("Failed to upload milestones and update metadata:", error);
      alert(
        `Failed to upload milestones and update metadata: ${error.message}`
      );
      setNotification("Failed to upload milestones and update metadata.");
      setTimeout(() => setNotification(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const totalPayments = () => {
    return milestones.reduce((total, milestone) => {
      return (
        total +
        parseFloat(milestone.paymentDetails?.replace(/[^0-9.-]+/g, "") || 0)
      );
    }, 0);
  };

  if (!selectedProject) {
    return (
      <div className={classes["no-project-selected"]}>
        <p>Please select a project to create a contract.</p>
      </div>
    );
  }

  return (
    <div className={classes["negotiation-page"]}>
      <div className={classes["negotiation-element-wrapper-top"]}>
        <p className={classes["text-wrapper"]}>
          You can generate a contract using AI, or you can manually create a
          contract below.
        </p>
        <input
          type="text"
          className={classes["input-project-info"]}
          placeholder="Enter Project Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button
          onClick={fetchGeneratedMilestones}
          className={classes["generate-template-button"]}
        >
          Generate Milestones
        </button>
      </div>
      {notification && (
        <div className={classes["notification"]}>{notification}</div>
      )}
      <input
        type="text"
        className={classes["input-project-info"]}
        placeholder="Enter Milestone Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className={classes["input-project-info"]}
        placeholder="Enter Milestone Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        type="date"
        className={classes["input-project-info"]}
        placeholder="Enter Milestone Deadline"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
      />
      <input
        type="text"
        className={classes["input-project-info"]}
        placeholder="Enter Payment Details"
        value={paymentDetails}
        onChange={(e) => setPaymentDetails(e.target.value)}
      />
      <input
        type="file"
        className={classes["input-project-info"]}
        onChange={(e) => setEvidenceFile(e.target.files[0])}
      />
      <button
        onClick={handleAddMilestone}
        className={classes["add-field-button"]}
      >
        Add Milestone
      </button>
      {milestones.map((milestone, index) => (
        <MilestoneItem
          key={milestone.id || index}
          milestone={milestone}
          index={index}
          handleMilestoneChange={handleMilestoneChange}
          handleRemoveMilestone={handleRemoveMilestone}
          handleFileUpload={handleFileUpload}
        />
      ))}
      <div className={classes["total-payments"]}>
        Total Payments: £{totalPayments()}
      </div>
      <button
        onClick={updateProjectMetadata}
        className={classes["generate-agreement"]}
      >
        Generate Contract
      </button>
    </div>
  );
};

export default ContractComponent;
