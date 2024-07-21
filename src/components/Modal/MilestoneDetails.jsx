import React, { useState, useRef } from "react";
import axios from "axios";
import Modal from "react-modal";
import ContractComponent from "../../../pages/contract creation/ContractComponent";
import styles from "./Styles/MilestoneDetails.module.css";

const MilestoneDetails = ({ milestone, onBack }) => {
  const [status, setStatus] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [capturedImageUrl, setCapturedImageUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const API_URL = "http://localhost:3003/api/milestones";
  const AI_SERVER_URL = "http://localhost:3002";

  const handleCompleteMilestone = async () => {
    if (!milestone) return;
    try {
      const response = await axios.post(`${API_URL}/complete`, {
        milestoneId: milestone.id,
      });
      setStatus(
        `Milestone ${milestone.id} completed successfully: ${response.data.message}`
      );
    } catch (error) {
      console.error("Failed to complete milestone:", error);
      setStatus("Error completing milestone: " + error.message);
    }
  };

  const handleVerifyMilestone = async (verified, verifierComment) => {
    if (!milestone) return;
    try {
      const response = await axios.post(`${API_URL}/verify`, {
        milestoneId: milestone.id,
        verified,
        verifierComment,
      });
      setStatus(
        `Milestone ${milestone.id} verified successfully: ${response.data.message}`
      );
    } catch (error) {
      console.error("Failed to verify milestone:", error);
      setStatus("Error verifying milestone: " + error.message);
    }
  };

  const handleHaltMilestone = async () => {
    if (!milestone) return;
    try {
      const response = await axios.post(`${API_URL}/halt`, {
        milestoneId: milestone.id,
      });
      setStatus(
        `Milestone ${milestone.id} halted successfully: ${response.data.message}`
      );
    } catch (error) {
      console.error("Failed to halt milestone:", error);
      setStatus("Error halting milestone: " + error.message);
    }
  };

  const handleEmergencyMilestone = async () => {
    if (!milestone) return;
    try {
      const response = await axios.post(`${API_URL}/emergency`, {
        milestoneId: milestone.id,
      });
      setStatus(
        `Emergency declared for milestone ${milestone.id}: ${response.data.message}`
      );
    } catch (error) {
      console.error("Failed to declare emergency:", error);
      setStatus("Error declaring emergency: " + error.message);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Failed to access camera");
    }
  };

  const stopCamera = () => {
    const stream = videoRef.current.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach((track) => {
      track.stop();
    });
    videoRef.current.srcObject = null;
  };

  const capturePhoto = () => {
    const context = canvasRef.current.getContext("2d");
    context.drawImage(
      videoRef.current,
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
    const dataUrl = canvasRef.current.toDataURL("image/png");
    setCapturedImageUrl(dataUrl);
    setImageFile(dataUrlToFile(dataUrl, "captured-image.png"));
  };

  const dataUrlToFile = (dataUrl, filename) => {
    const arr = dataUrl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const uploadPhoto = async () => {
    if (!imageFile) {
      alert("No photo to upload");
      return;
    }

    const imageData = new FormData();
    imageData.append("file", imageFile);

    try {
      const response = await axios.post(
        "http://localhost:3003/upload",
        imageData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      const fileUrl = response.data.fileUrl;
      setImageUrl(fileUrl);
      setStatus(`Photo uploaded: ${fileUrl}`);
    } catch (error) {
      console.error("Error uploading photo:", error);
      setStatus("Error uploading photo");
    }
  };

  const analyzeImage = async () => {
    if (!imageUrl) {
      alert("Please capture or upload an image first.");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`${AI_SERVER_URL}/analyze-image`, {
        imageUrl,
      });
      setAnalysisResult(response.data.description);
      setLoading(false);
    } catch (error) {
      console.error("Error analyzing image:", error);
      setLoading(false);
      alert("Failed to analyze the image.");
    }
  };

  return (
    <div className={styles.milestoneDetails}>
      <div className={styles.buttonContainer}>
        <button className={styles.milestoneButton} onClick={onBack}>
          Back to Milestones
        </button>
        <button
          className={styles.milestoneButton}
          onClick={handleCompleteMilestone}
        >
          Complete Milestone
        </button>
        <button
          className={styles.milestoneButton}
          onClick={() => handleVerifyMilestone(true, "Verified successfully")}
        >
          Verify Milestone
        </button>
        <button
          className={`${styles.milestoneButton} ${styles.haltButton}`}
          onClick={handleHaltMilestone}
        >
          Halt Milestone
        </button>
        <button
          className={`${styles.milestoneButton} ${styles.emergencyButton}`}
          onClick={handleEmergencyMilestone}
        >
          Declare Emergency
        </button>
        <button
          className={styles.milestoneButton}
          onClick={() => setIsContractModalOpen(true)}
        >
          Add Sub-Milestones
        </button>
      </div>
      <h4>{milestone.title}</h4>
      <p>{milestone.description}</p>
      <div className={styles.evidenceSection}>
        <h3>Upload Evidence</h3>
        <div className={styles.videoContainer}>
          <video
            ref={videoRef}
            width="320"
            height="240"
            autoPlay
            className={styles.videoCanvas}
          />
          <div className={styles.cameraButtonContainer}>
            <button className={styles.milestoneButton} onClick={startCamera}>
              Start Camera
            </button>
            <button className={styles.milestoneButton} onClick={capturePhoto}>
              Capture Photo
            </button>
            <button className={styles.milestoneButton} onClick={stopCamera}>
              Stop Camera
            </button>
            <button className={styles.milestoneButton} onClick={uploadPhoto}>
              Upload Photo
            </button>
            <button
              className={styles.milestoneButton}
              onClick={analyzeImage}
              disabled={loading}
            >
              Analyze Image
            </button>
          </div>
        </div>
        <canvas
          ref={canvasRef}
          width="320"
          height="240"
          style={{ display: "none" }}
        />
        {capturedImageUrl && (
          <div>
            <h4>Captured Photo:</h4>
            <img
              src={capturedImageUrl}
              alt="Captured"
              style={{ width: "320px", height: "240px" }}
            />
          </div>
        )}
        {imageUrl && (
          <div>
            <h4>Uploaded Photo:</h4>
            <img
              src={imageUrl}
              alt="Uploaded"
              style={{ width: "320px", height: "240px" }}
            />
          </div>
        )}
        {analysisResult && (
          <div>
            <h4>Analysis Result:</h4>
            <p>{analysisResult}</p>
          </div>
        )}
      </div>
      <div className={styles.status}>{status}</div>
      <Modal
        isOpen={isContractModalOpen}
        onRequestClose={() => setIsContractModalOpen(false)}
        contentLabel="Add Sub-Milestones"
      >
        <ContractComponent />
      </Modal>
    </div>
  );
};

export default MilestoneDetails;
